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
import { Project } from "../../../types";
import { waitFor } from "@testing-library/react";
import { ProjectFormValues } from "../../../types/form-values-types";
import { FormikHelpers } from "formik";
import { formatDate } from "../..";
import { toast } from "react-toastify";
import { auth, db } from "../../../firebaseConfig";

// Mock auth and db
vi.mock("../../", () => ({
  auth: { currentUser: null },
  db: {},
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
}); // Mock formatDate
vi.mock("../..", { spy: true });
vi.mock("react-toastify", { spy: true });

describe("getAllProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all projects", async () => {
    const projectsCollection = "projectsCollection";
    (collection as Mock).mockReturnValue(projectsCollection);
    const result = (await getAllProjects()) as Project[];
    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(getDocs).toHaveBeenCalled();
    expect(result).not.toBeUndefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should manage errors correctly", async () => {
    const error = new Error("Firestore error");
    (getDocs as Mock).mockRejectedValue(error);

    const consoleErrorSpy = vi.spyOn(console, "error");

    const projects: Project[] = (await getAllProjects()) as Project[];

    await waitFor(() => {
      expect(collection).toHaveBeenCalledWith(db, "projects");
      expect(getDocs).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error reading projects: ",
        error
      );
      expect(projects).toBeUndefined();
    });
  });
});

describe("getProjectById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const projectId = "fa59a499-d803-4043-910e-2bf6e7bc64c7";

  it("should return project when projectId is provided", async () => {
    const result = { projectId, name: "Project 1" };
    (getDocs as Mock).mockResolvedValue({
      docs: [{ data: () => result }],
    });
    const project = await getProjectById(projectId);
    await waitFor(() => {
      expect(collection).toHaveBeenCalledWith(db, "projects");
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith("projectId", "==", projectId);
      expect(getDocs).toHaveBeenCalled();
      expect(project).toEqual(result);
    });
  });
  it("should return null and log a message when querySnapshot is empty", async () => {
    (getDocs as Mock).mockResolvedValue({ empty: true });
    const consoleLogSpy = vi.spyOn(console, "log");
    const project = await getProjectById(projectId);
    await waitFor(() => {
      expect(collection).toHaveBeenCalledWith(db, "projects");
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith("projectId", "==", projectId);
      expect(getDocs).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
      expect(project).toBeNull();
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (getDocs as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    const project = await getProjectById(projectId);

    await waitFor(() => {
      expect(collection).toHaveBeenCalledWith(db, "projects");
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith("projectId", "==", projectId);
      expect(getDocs).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error reading project: ",
        error
      );
      expect(project).toBeUndefined();
    });
  });
});
describe("getAllProjectIds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should return all project ids", async () => {
    const projects = [{ projectId: "1" }, { projectId: "2" }];
    (getDocs as Mock).mockResolvedValue({
      docs: [{ data: () => projects[0] }, { data: () => projects[1] }],
    });
    const projectIds = await getAllProjectIds();
    await waitFor(() => {
      expect(collection).toHaveBeenCalledWith(db, "projects");
      expect(getDocs).toHaveBeenCalled();
      expect(projectIds).toBeDefined();
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (getDocs as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    const projects = await getAllProjectIds();

    await waitFor(() => {
      expect(collection).toHaveBeenCalledWith(db, "projects");
      expect(getDocs).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error reading project IDs: ",
        error
      );
      expect(projects).toBeUndefined();
    });
  });
});

describe("handleCreateProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const values: ProjectFormValues = {
    customerId: "12345",
    description: "Proyecto de desarrollo de una aplicación móvil",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    name: "App Móvil de Gestión de Tareas",
    state: "En progreso",
    employeeId: "employeeId",
  };

  const formikHelpers = {
    resetForm: vi.fn(),
  } as unknown as FormikHelpers<ProjectFormValues>;

  it("should create a new project", async () => {
    await handleCreateProject(values, formikHelpers);
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("customerId", "==", values.customerId));
    const querySnapshot = await getDocs(q);
    await waitFor(() => {
      expect(querySnapshot.docs[0]).toBeDefined();
      expect(toast.success).toHaveBeenCalledWith("Project created");
      expect(formikHelpers.resetForm).toHaveBeenCalled();
    });

    const deletePromises: Promise<void>[] = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    await Promise.all(deletePromises);
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (addDoc as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    await handleCreateProject(values, formikHelpers);
    expect(addDoc).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error creating customer: ",
      error
    );
  });
});

describe("handleEditProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const selectedProjectId = "dummy-projectId-3";

  const values: ProjectFormValues = {
    customerId: "customer3",
    description: "description3",
    startDate: "2025-01-30",
    endDate: "2025-07-06",
    name: "name3",
    state: "pending",
    employeeId: "employeeId",
  };

  const formikHelpers = {
    resetForm: vi.fn(),
  } as unknown as FormikHelpers<ProjectFormValues>;

  it("should edit a project successfully", async () => {
    const customerId = "customer33";
    await handleEditProject(
      selectedProjectId,
      { ...values, customerId },
      formikHelpers
    );
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("customerId", "==", customerId));
    const querySnapshot = await getDocs(q);
    await waitFor(() => {
      expect(querySnapshot.empty).toBe(false);
      expect(collection).toHaveBeenCalledWith(db, "projects");
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith("projectId", "==", selectedProjectId);
      expect(getDocs).toHaveBeenCalled();
      expect(doc).toHaveBeenCalled();
      expect(updateDoc).toHaveBeenCalled();
      expect(formatDate).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Project updated");
      expect(formikHelpers.resetForm).toHaveBeenCalled();
    });

    const updatePromises: Promise<void>[] = [];
    querySnapshot.forEach((doc) => {
      updatePromises.push(
        updateDoc(doc.ref, { customerId: values.customerId })
      );
    });
    await Promise.all(updatePromises);
  });
  it("should return null and log a message if query is empty", async () => {
    (getDocs as Mock).mockReturnValue({
      empty: true,
      docs: [],
    });
    const consoleLogSpy = vi.spyOn(console, "log");
    const result = await handleEditProject(
      selectedProjectId,
      values,
      formikHelpers
    );
    await waitFor(() => {
      expect(collection).toHaveBeenCalledWith(db, "projects");
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith("projectId", "==", selectedProjectId);
      expect(getDocs).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
      expect(result).toBeNull();
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (getDocs as Mock).mockRejectedValue(error);
    await handleEditProject(selectedProjectId, values, formikHelpers);
    const consoleErrorSpy = vi.spyOn(console, "error");
    await waitFor(() => {
      expect(collection).toHaveBeenCalledWith(db, "projects");
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith("projectId", "==", selectedProjectId);
      expect(getDocs).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error updating customer: ",
        error
      );
    });
  });
});

describe("deleteProjectById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const project = {
    createdAt: "29/01/2025 19:38",
    customerId: "customer4",
    description: "description4",
    developer: "developer4",
    endDate: "2025-07-06",
    name: "name4",
    projectId: "dummy-projectId-4",
    startDate: "2025-01-30",
    state: "pending",
  };
  it("should delete project successfully", async () => {
    await deleteProjectById(project.projectId);

    await waitFor(() => {
      expect(collection).toHaveBeenCalledWith(db, "projects");
      expect(query).toHaveBeenCalled();
      expect(getDocs).toHaveBeenCalled();
      expect(doc).toHaveBeenCalled();
      expect(deleteDoc).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Project deleted");
    });

    const projectsRef = collection(db, "projects");
    await addDoc(projectsRef, project);
    const q = query(projectsRef, where("projectId", "==", project.projectId));
    const querySnapshot = await getDocs(q);
    expect(querySnapshot.empty).toBe(false);
  });
  it("should return null and log a message when querySnapshot is empty", async () => {
    (getDocs as Mock).mockResolvedValue({
      empty: true,
      docs: [],
    });
    const consoleLogSpy = vi.spyOn(console, "log");
    const result = await deleteProjectById(project.projectId);
    await waitFor(() => {
      expect(collection).toHaveBeenCalledWith(db, "projects");
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith("projectId", "==", project.projectId);
      expect(getDocs).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
      expect(result).toBeNull();
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (getDocs as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    await deleteProjectById(project.projectId);
    expect(collection).toHaveBeenCalledWith(db, "projects");
    expect(query).toHaveBeenCalled();
    expect(where).toHaveBeenCalledWith("projectId", "==", project.projectId);
    expect(getDocs).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error deleting project: ",
      error
    );
  });
});
