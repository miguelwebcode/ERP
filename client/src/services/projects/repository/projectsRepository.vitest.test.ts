import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import {
  deleteProjectById,
  getAllProjectIds,
  getAllProjects,
  getProjectById,
  handleCreateProject,
  handleEditProject,
} from "./projectsRepository";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ProjectFormValues } from "../../../types/form-values-types";
import { FormikHelpers } from "formik";
import { formatDate } from "../..";
import { toast } from "react-toastify";
import { db } from "../../../firebaseConfig";

vi.mock("react-toastify", { spy: true });

// Mock auth and db
vi.mock("../../../firebaseConfig", () => ({
  auth: { currentUser: null },
  db: {},
  functions: {},
}));

// Mock firestore functions
vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    doc: vi.fn(),
    deleteDoc: vi.fn(),
  };
});

// Mock uuid
vi.mock("uuid", () => ({
  v4: vi.fn().mockReturnValue("mocked-uuid"),
}));

// Mock formatDate
vi.mock("../..", () => ({
  formatDate: vi.fn(() => "formatted-date"),
}));

describe("getAllProjects", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should return projects", async () => {
    const mockData = [
      { id: "1", name: "Project 1" },
      { id: "2", name: "Project 2" },
    ];

    (getDocs as Mock).mockReturnValue({
      docs: mockData.map((doc) => ({ data: () => doc })),
    });

    const projects = await getAllProjects();
    expect(projects).toEqual(mockData);
    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(getDocs).toHaveBeenCalledOnce();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("Firestore error");
    (getDocs as Mock).mockRejectedValue(error);
    const projectsCollection = {};
    (collection as Mock).mockReturnValue(projectsCollection);

    const projects = await getAllProjects();

    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(getDocs).toHaveBeenCalledWith(projectsCollection);
    expect(projects).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading projects: ",
      error
    );
  });
});

describe("getProjectById", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    consoleLogSpy = vi.spyOn(console, "log");
  });
  const projectId = "fa59a499-d803-4043-910e-2bf6e7bc64c7";

  it("should return project when projectId has value", async () => {
    const projectData = {
      id: projectId,
      name: "Project 1",
    };

    const projectsCollection = {};
    (collection as Mock).mockReturnValue(projectsCollection);
    const q = "";
    (query as Mock).mockReturnValue(q);
    const querySnapshot = {
      empty: false,
      docs: [{ data: () => projectData }],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);

    const result = await getProjectById(projectId);

    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(where).toHaveBeenCalledWith("id", "==", projectId);
    expect(query).toHaveBeenCalledWith(
      projectsCollection,
      where("id", "==", projectId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalledWith("No matching documents.");
    expect(consoleLogSpy).toHaveBeenCalledWith("project data: ", projectData);
    expect(result).toEqual(projectData);
  });

  it("should return null if querySnapshot is empty", async () => {
    const projectsCollection = {};
    (collection as Mock).mockReturnValue(projectsCollection);
    const q = "";
    (query as Mock).mockReturnValue(q);

    const querySnapshot = {
      empty: true,
      docs: [],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const result = await getProjectById(projectId);
    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(query).toHaveBeenCalledWith(
      projectsCollection,
      where("id", "==", projectId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
    expect(result).toBeNull();
  });

  it("should manage thrown error correctly", async () => {
    const projectsCollection = {};
    (collection as Mock).mockReturnValue(projectsCollection);
    const q = "";
    (query as Mock).mockReturnValue(q);

    const error = new Error("Error message");
    (getDocs as Mock).mockRejectedValue(error);

    const result = await getProjectById(projectId);

    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(query).toHaveBeenCalledWith(
      projectsCollection,
      where("id", "==", projectId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalledWith("No matching documents.");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading project: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
describe("getAllProjectIds", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  const projectIds = [1, 2];
  it("should return project ids", async () => {
    const mockProjectDocs = projectIds.map((id) => ({
      data: () => ({
        id,
      }),
    }));
    const projectsCollection = {};
    (collection as Mock).mockReturnValue(projectsCollection);
    const querySnapshot = {
      docs: mockProjectDocs,
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);

    const result = await getAllProjectIds();
    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(getDocs).toHaveBeenCalledWith(projectsCollection);
    expect(result).toEqual(projectIds);
  });

  it("should manage errors correctly", async () => {
    const projectsCollection = {};
    (collection as Mock).mockReturnValue(projectsCollection);
    const error = new Error("Error message");
    (getDocs as Mock).mockRejectedValue(error);

    const result = await getAllProjectIds();
    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(getDocs).toHaveBeenCalledWith(projectsCollection);
    expect(result).not.toEqual(projectIds);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading project IDs: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("handleCreateProject", () => {
  const dummyValues = {
    customerId: "12345",
    description: "Proyecto de desarrollo de una aplicación móvil",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    name: "App Móvil de Gestión de Tareas",
    state: "En progreso",
    employeeId: "employeeId",
  } as ProjectFormValues;
  const formikHelpers = {
    resetForm: vi.fn(),
  } as unknown as FormikHelpers<ProjectFormValues>;

  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should create a new project successfully", async () => {
    const docRef = { id: "1" };
    (addDoc as Mock).mockReturnValue(docRef);
    const result = await handleCreateProject(dummyValues, formikHelpers);
    expect(addDoc).toHaveBeenCalledWith(collection(db, "projects"), {
      ...dummyValues,
      createdAt: formatDate(new Date()),
    });
    expect(updateDoc).toHaveBeenCalledWith(docRef, { id: docRef.id });
    expect(toast.success).toHaveBeenCalledWith("Project created");
    expect(formikHelpers.resetForm).toHaveBeenCalled();
    expect(result).toBeUndefined();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (addDoc as Mock).mockRejectedValue(error);
    const result = await handleCreateProject(dummyValues, formikHelpers);
    expect(addDoc).toHaveBeenCalledWith(collection(db, "projects"), {
      ...dummyValues,
      createdAt: formatDate(new Date()),
    });
    expect(updateDoc).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(formikHelpers.resetForm).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});

describe("handleEditProject", () => {
  const selectedProjectId = "1";
  const values = {
    customerId: "customer3",
    description: "description3",
    startDate: "2025-01-30",
    endDate: "2025-07-06",
    name: "name3",
    state: "pending",
    employeeId: "employeeId",
  } as ProjectFormValues;
  const formikHelpers = {
    resetForm: vi.fn(),
  } as unknown as FormikHelpers<ProjectFormValues>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log");
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should update project successfully", async () => {
    const projectsCollection = "projectsCollection";
    (collection as Mock).mockReturnValue(projectsCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);
    const documentId = "1";
    const querySnapshot = {
      empty: false,
      docs: [{ id: documentId }],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const projectDocRef = "projectDocRef";
    (doc as Mock).mockReturnValue(projectDocRef);
    const result = await handleEditProject(
      selectedProjectId,
      values,
      formikHelpers
    );
    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(query).toHaveBeenCalledWith(
      projectsCollection,
      where("id", "==", selectedProjectId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "projects", documentId);
    expect(updateDoc).toHaveBeenCalledWith(projectDocRef, {
      ...values,
      updatedAt: formatDate(new Date()),
    });
    expect(toast.success).toHaveBeenCalledWith("Project updated");
    expect(formikHelpers.resetForm).toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should return null and don't update if document not found", async () => {
    const projectsCollection = "projectsCollection";
    (collection as Mock).mockReturnValue(projectsCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);
    const querySnapshot = {
      empty: true,
      docs: [],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const result = await handleEditProject(
      selectedProjectId,
      values,
      formikHelpers
    );
    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(query).toHaveBeenCalledWith(
      projectsCollection,
      where("id", "==", selectedProjectId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
    expect(result).toBeNull();
    expect(doc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(formikHelpers.resetForm).not.toHaveBeenCalled();
  });

  it("should manage errors correctly", async () => {
    const projectsCollection = "projectsCollection";
    (collection as Mock).mockReturnValue(projectsCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);

    const error = new Error("Test error");
    (getDocs as Mock).mockRejectedValue(error);
    const result = await handleEditProject(
      selectedProjectId,
      values,
      formikHelpers
    );
    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(query).toHaveBeenCalledWith(
      projectsCollection,
      where("id", "==", selectedProjectId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(doc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(formikHelpers.resetForm).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error updating customer: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("deleteProjectById", () => {
  const projectId = "1";

  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log");
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should delete project successfully", async () => {
    const projectsCollection = "projectsCollection";
    (collection as Mock).mockReturnValue(projectsCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);
    const documentId = "1";
    const querySnapshot = {
      empty: false,
      docs: [{ id: documentId }],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const projectDocRef = "projectDocRef";
    (doc as Mock).mockReturnValue(projectDocRef);

    const result = await deleteProjectById(projectId);
    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(query).toHaveBeenCalledWith(
      projectsCollection,
      where("id", "==", projectId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "projects", documentId);
    expect(deleteDoc).toHaveBeenCalledWith(projectDocRef);
    expect(toast.success).toHaveBeenCalledWith("Project deleted");
    expect(result).toBeUndefined();
  });

  it("should return null and don't delete project if document not found", async () => {
    const projectsCollection = "projectsCollection";
    (collection as Mock).mockReturnValue(projectsCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);
    const querySnapshot = {
      empty: true,
      docs: [],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const result = await deleteProjectById(projectId);
    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(query).toHaveBeenCalledWith(
      projectsCollection,
      where("id", "==", projectId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
    expect(result).toBeNull();
    expect(doc).not.toHaveBeenCalled();
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("should manage errors correctly", async () => {
    const projectsCollection = "projectsCollection";
    (collection as Mock).mockReturnValue(projectsCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);

    const error = new Error("Test error");
    (getDocs as Mock).mockRejectedValue(error);
    const result = await deleteProjectById(projectId);
    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(query).toHaveBeenCalledWith(
      projectsCollection,
      where("id", "==", projectId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(doc).not.toHaveBeenCalled();
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error deleting project: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
