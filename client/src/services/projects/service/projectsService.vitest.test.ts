import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { waitFor } from "@testing-library/react";
import { FormikProps } from "formik";
import { ProjectFormValues } from "../../../types/form-values-types";
import * as projectsRepository from "../repository/projectsRepository";
import {
  fetchAllProjects,
  fetchProject,
  fetchProjectIds,
  setProjectFormValues,
} from "./projectsService";

vi.mock("../repository/projectsRepository", { spy: true });

describe("fetchProjectIds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const callback = vi.fn();

  it("should return all project ids and execute callback", async () => {
    await fetchProjectIds(callback);
    expect(projectsRepository.getAllProjectIds).toHaveBeenCalled();
    expect(callback).toHaveBeenCalled();
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    const consoleErrorSpy = vi.spyOn(console, "error");
    (projectsRepository.getAllProjectIds as Mock).mockRejectedValue(error);
    await fetchProjectIds(callback);
    expect(projectsRepository.getAllProjectIds).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching project IDs: ",
      error
    );
  });
});

describe("setProjectFormValues", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const formik = {
    setValues: vi.fn(),
  } as unknown as FormikProps<ProjectFormValues>;
  const selectedProjectId = "dummy-projectId-3";

  it("should get project and set form values", async () => {
    await setProjectFormValues(formik, selectedProjectId);
    await waitFor(() => {
      expect(projectsRepository.getProjectById).toHaveBeenCalledWith(
        selectedProjectId
      );
      expect(formik.setValues).toHaveBeenCalled();
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (projectsRepository.getProjectById as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    await setProjectFormValues(formik, selectedProjectId);
    await waitFor(() => {
      expect(projectsRepository.getProjectById).toHaveBeenCalledWith(
        selectedProjectId
      );
      expect(formik.setValues).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching project: ",
        error
      );
    });
  });
});

describe("fetchProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const selectedProjectId = "1";
  const callback = vi.fn();
  it("should fetch project by id and pass it as arg to callback", async () => {
    const result = { id: "1", name: "Project 1" };
    (projectsRepository.getProjectById as Mock).mockResolvedValue(result);

    await fetchProject(selectedProjectId, callback);
    await waitFor(() => {
      expect(projectsRepository.getProjectById).toHaveBeenCalledWith(
        selectedProjectId
      );
      expect(callback).toHaveBeenCalled();
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (projectsRepository.getProjectById as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    await fetchProject(selectedProjectId, callback);
    await waitFor(() => {
      expect(projectsRepository.getProjectById).toHaveBeenCalledWith(
        selectedProjectId
      );
      expect(callback).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching project: ",
        error
      );
    });
  });
});

describe("fetchAllProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const callback = vi.fn();
  it("should get all projects and pass them to callback", async () => {
    await fetchAllProjects(callback);
    await waitFor(() => {
      expect(projectsRepository.getAllProjects).toHaveBeenCalled();
      expect(callback).toHaveBeenCalled();
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    const consoleErrorSpy = vi.spyOn(console, "error");
    (projectsRepository.getAllProjects as Mock).mockRejectedValue(error);
    await fetchAllProjects(callback);
    await waitFor(() => {
      expect(projectsRepository.getAllProjects).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching projects: ",
        error
      );
    });
  });
});
