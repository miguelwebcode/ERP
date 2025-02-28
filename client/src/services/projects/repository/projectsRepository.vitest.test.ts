import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import * as firebaseConfig from "../../../firebaseConfig";
import * as firestoreMethods from "firebase/firestore";
import {
  getAllProjectIds,
  getAllProjects,
  getProjectById,
  handleCreateProject,
} from "./projectsRepository";
import { Project } from "../../../types";
import { waitFor } from "@testing-library/react";
import { ProjectFormValues } from "../../../types/form-values-types";
import { FormikHelpers } from "formik";

vi.mock("../../firebaseConfig", { spy: true });
vi.mock("firebase/firestore", { spy: true });

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
