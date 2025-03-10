import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import * as firebaseConfig from "../../../firebaseConfig";
import * as firestoreMethods from "firebase/firestore";
import {
  deleteProjectById,
  getAllProjectIds,
  getAllProjects,
  getProjectById,
  handleCreateProject,
  handleEditProject,
} from "./projectsRepository";
import { Project } from "../../../types";
import { waitFor } from "@testing-library/react";
import { ProjectFormValues } from "../../../types/form-values-types";
import { FormikHelpers } from "formik";
import * as utilsFunctions from "../..";
import { toast } from "react-toastify";

vi.mock("../../firebaseConfig", { spy: true });
vi.mock("firebase/firestore", { spy: true });
vi.mock("../..", { spy: true });
vi.mock("react-toastify", { spy: true });

describe("getAllProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all projects", async () => {
    const projects: Project[] = (await getAllProjects()) as Project[];
    await waitFor(() => {
      expect(firestoreMethods.collection).toHaveBeenCalledWith(
        firebaseConfig.db,
        "projects"
      );
      expect(firestoreMethods.getDocs).toHaveBeenCalled();
      expect(projects).not.toBeUndefined();
      expect(projects.length).toBeGreaterThan(0);
    });
  });

  it("should manage errors correctly", async () => {
    const error = new Error("Firestore error");
    (firestoreMethods.getDocs as Mock).mockRejectedValue(error);

    const consoleErrorSpy = vi.spyOn(console, "error");

    const projects: Project[] = (await getAllProjects()) as Project[];

    await waitFor(() => {
      expect(firestoreMethods.collection).toHaveBeenCalledWith(
        firebaseConfig.db,
        "projects"
      );
      expect(firestoreMethods.getDocs).toHaveBeenCalled();
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
    (firestoreMethods.getDocs as Mock).mockResolvedValue({
      docs: [{ data: () => result }],
    });
    const project = await getProjectById(projectId);
    await waitFor(() => {
      expect(firestoreMethods.collection).toHaveBeenCalledWith(
        firebaseConfig.db,
        "projects"
      );
      expect(firestoreMethods.query).toHaveBeenCalled();
      expect(firestoreMethods.where).toHaveBeenCalledWith(
        "projectId",
        "==",
        projectId
      );
      expect(firestoreMethods.getDocs).toHaveBeenCalled();
      expect(project).toEqual(result);
    });
  });
  it("should return null and log a message when querySnapshot is empty", async () => {
    (firestoreMethods.getDocs as Mock).mockResolvedValue({ empty: true });
    const consoleLogSpy = vi.spyOn(console, "log");
    const project = await getProjectById(projectId);
    await waitFor(() => {
      expect(firestoreMethods.collection).toHaveBeenCalledWith(
        firebaseConfig.db,
        "projects"
      );
      expect(firestoreMethods.query).toHaveBeenCalled();
      expect(firestoreMethods.where).toHaveBeenCalledWith(
        "projectId",
        "==",
        projectId
      );
      expect(firestoreMethods.getDocs).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
      expect(project).toBeNull();
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (firestoreMethods.getDocs as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    const project = await getProjectById(projectId);

    await waitFor(() => {
      expect(firestoreMethods.collection).toHaveBeenCalledWith(
        firebaseConfig.db,
        "projects"
      );
      expect(firestoreMethods.query).toHaveBeenCalled();
      expect(firestoreMethods.where).toHaveBeenCalledWith(
        "projectId",
        "==",
        projectId
      );
      expect(firestoreMethods.getDocs).toHaveBeenCalled();
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
    (firestoreMethods.getDocs as Mock).mockResolvedValue({
      docs: [{ data: () => projects[0] }, { data: () => projects[1] }],
    });
    const projectIds = await getAllProjectIds();
    await waitFor(() => {
      expect(firestoreMethods.collection).toHaveBeenCalledWith(
        firebaseConfig.db,
        "projects"
      );
      expect(firestoreMethods.getDocs).toHaveBeenCalled();
      expect(projectIds).toBeDefined();
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (firestoreMethods.getDocs as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    const projects = await getAllProjectIds();

    await waitFor(() => {
      expect(firestoreMethods.collection).toHaveBeenCalledWith(
        firebaseConfig.db,
        "projects"
      );
      expect(firestoreMethods.getDocs).toHaveBeenCalled();
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
    developer: "Juan Pérez",
  };

  const formikHelpers = {
    resetForm: vi.fn(),
  } as unknown as FormikHelpers<ProjectFormValues>;

  it("should create a new project", async () => {
    await handleCreateProject(values, formikHelpers);
    const projectsRef = firestoreMethods.collection(
      firebaseConfig.db,
      "projects"
    );
    const q = firestoreMethods.query(
      projectsRef,
      firestoreMethods.where("customerId", "==", values.customerId)
    );
    const querySnapshot = await firestoreMethods.getDocs(q);
    await waitFor(() => {
      expect(querySnapshot.docs[0]).toBeDefined();
      expect(toast.success).toHaveBeenCalledWith("Project created");
      expect(formikHelpers.resetForm).toHaveBeenCalled();
    });

    const deletePromises: Promise<void>[] = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(firestoreMethods.deleteDoc(doc.ref));
    });
    await Promise.all(deletePromises);
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (firestoreMethods.addDoc as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    await handleCreateProject(values, formikHelpers);
    expect(firestoreMethods.addDoc).toHaveBeenCalled();
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
    developer: "developer3",
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
    const projectsRef = firestoreMethods.collection(
      firebaseConfig.db,
      "projects"
    );
    const q = firestoreMethods.query(
      projectsRef,
      firestoreMethods.where("customerId", "==", customerId)
    );
    const querySnapshot = await firestoreMethods.getDocs(q);
    await waitFor(() => {
      expect(querySnapshot.empty).toBe(false);
      expect(firestoreMethods.collection).toHaveBeenCalledWith(
        firebaseConfig.db,
        "projects"
      );
      expect(firestoreMethods.query).toHaveBeenCalled();
      expect(firestoreMethods.where).toHaveBeenCalledWith(
        "projectId",
        "==",
        selectedProjectId
      );
      expect(firestoreMethods.getDocs).toHaveBeenCalled();
      expect(firestoreMethods.doc).toHaveBeenCalled();
      expect(firestoreMethods.updateDoc).toHaveBeenCalled();
      expect(utilsFunctions.formatDate).toHaveBeenCalled();
      expect(formikHelpers.resetForm).toHaveBeenCalled();
    });

    const updatePromises: Promise<void>[] = [];
    querySnapshot.forEach((doc) => {
      updatePromises.push(
        firestoreMethods.updateDoc(doc.ref, { customerId: values.customerId })
      );
    });
    await Promise.all(updatePromises);
  });
  it("should return null and log a message if query is empty", async () => {
    (firestoreMethods.getDocs as Mock).mockReturnValue({
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
      expect(firestoreMethods.collection).toHaveBeenCalledWith(
        firebaseConfig.db,
        "projects"
      );
      expect(firestoreMethods.query).toHaveBeenCalled();
      expect(firestoreMethods.where).toHaveBeenCalledWith(
        "projectId",
        "==",
        selectedProjectId
      );
      expect(firestoreMethods.getDocs).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
      expect(result).toBeNull();
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (firestoreMethods.getDocs as Mock).mockRejectedValue(error);
    await handleEditProject(selectedProjectId, values, formikHelpers);
    const consoleErrorSpy = vi.spyOn(console, "error");
    await waitFor(() => {
      expect(firestoreMethods.collection).toHaveBeenCalledWith(
        firebaseConfig.db,
        "projects"
      );
      expect(firestoreMethods.query).toHaveBeenCalled();
      expect(firestoreMethods.where).toHaveBeenCalledWith(
        "projectId",
        "==",
        selectedProjectId
      );
      expect(firestoreMethods.getDocs).toHaveBeenCalled();
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
      expect(firestoreMethods.collection).toHaveBeenCalledWith(
        firebaseConfig.db,
        "projects"
      );
      expect(firestoreMethods.query).toHaveBeenCalled();
      expect(firestoreMethods.getDocs).toHaveBeenCalled();
      expect(firestoreMethods.doc).toHaveBeenCalled();
      expect(firestoreMethods.deleteDoc).toHaveBeenCalled();
    });

    const projectsRef = firestoreMethods.collection(
      firebaseConfig.db,
      "projects"
    );
    await firestoreMethods.addDoc(projectsRef, project);
    const q = firestoreMethods.query(
      projectsRef,
      firestoreMethods.where("projectId", "==", project.projectId)
    );
    const querySnapshot = await firestoreMethods.getDocs(q);
    expect(querySnapshot.empty).toBe(false);
  });
  it("should return null and log a message when querySnapshot is empty", async () => {
    (firestoreMethods.getDocs as Mock).mockResolvedValue({
      empty: true,
      docs: [],
    });
    const consoleLogSpy = vi.spyOn(console, "log");
    const result = await deleteProjectById(project.projectId);
    await waitFor(() => {
      expect(firestoreMethods.collection).toHaveBeenCalledWith(
        firebaseConfig.db,
        "projects"
      );
      expect(firestoreMethods.query).toHaveBeenCalled();
      expect(firestoreMethods.where).toHaveBeenCalledWith(
        "projectId",
        "==",
        project.projectId
      );
      expect(firestoreMethods.getDocs).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
      expect(result).toBeNull();
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (firestoreMethods.getDocs as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    await deleteProjectById(project.projectId);
    expect(firestoreMethods.collection).toHaveBeenCalledWith(
      firebaseConfig.db,
      "projects"
    );
    expect(firestoreMethods.query).toHaveBeenCalled();
    expect(firestoreMethods.where).toHaveBeenCalledWith(
      "projectId",
      "==",
      project.projectId
    );
    expect(firestoreMethods.getDocs).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error deleting project: ",
      error
    );
  });
});
