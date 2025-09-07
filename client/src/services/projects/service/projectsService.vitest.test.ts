import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { FormikProps } from "formik";
import { ProjectFormValues } from "../../../types/form-values-types";
import {
  getAllProjectIds,
  getProjectById,
  getAllProjects,
} from "../repository/projectsRepository";
import {
  fetchAllProjects,
  fetchProject,
  fetchProjectIds,
  setProjectFormValues,
} from "./projectsService";

vi.mock("../repository/projectsRepository", () => ({
  getAllProjectIds: vi.fn(),
  getProjectById: vi.fn(),
  getAllProjects: vi.fn(),
}));

describe("fetchProjectIds", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let callback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    callback = vi.fn((_ids: string[]) => void 0);
  });

  it("should get ids and pass ids as arg", async () => {
    const ids = ["1", "2", "3"];
    (getAllProjectIds as Mock).mockReturnValue(ids);
    const result = await fetchProjectIds(callback);
    expect(getAllProjectIds).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(ids);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("error message");
    (getAllProjectIds as Mock).mockRejectedValue(error);
    const result = await fetchProjectIds(callback);
    expect(getAllProjectIds).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching project IDs: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("setProjectFormValues", () => {
  const formik = {
    setValues: vi.fn((_newValues: ProjectFormValues) => void 0),
  } as unknown as FormikProps<ProjectFormValues>;
  const selectedProjectId = "1";

  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should set form values", async () => {
    const selectedProject = {
      id: "1",
      name: "Project 1",
      state: "active",
      description: "Project description",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      customerId: "customer1",
      employeeId: "employee1",
    };
    (getProjectById as Mock).mockReturnValue(selectedProject);

    const { id, ...formValues } = selectedProject;
    const newValues: ProjectFormValues = formValues;

    const result = await setProjectFormValues(formik, selectedProjectId);
    expect(getProjectById).toHaveBeenCalledWith(selectedProjectId);
    expect(formik.setValues).toHaveBeenCalledWith(newValues);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("test error");
    (getProjectById as Mock).mockRejectedValue(error);
    const result = await setProjectFormValues(formik, selectedProjectId);
    expect(getProjectById).toHaveBeenCalledWith(selectedProjectId);
    expect(formik.setValues).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching project: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("fetchProject", () => {
  const selectedProjectId = "1";
  let callback: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    callback = vi.fn((_value: React.SetStateAction<any>) => void 0);
  });

  it("should fetch project data", async () => {
    const project = {
      id: "1",
      name: "Project 1",
      state: "active",
      description: "Project description",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      customerId: "customer1",
      employeeId: "employee1",
    };
    (getProjectById as Mock).mockReturnValue(project);
    const result = await fetchProject(selectedProjectId, callback);
    expect(getProjectById).toHaveBeenCalledWith(selectedProjectId);
    expect(callback).toHaveBeenCalledWith(project);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("error msg");
    (getProjectById as Mock).mockRejectedValue(error);
    const result = await fetchProject(selectedProjectId, callback);
    expect(getProjectById).toHaveBeenCalledWith(selectedProjectId);
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching project: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("fetchAllProjects", () => {
  let callback: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    callback = vi.fn((_value: React.SetStateAction<any[]>) => void 0);
  });

  it("should fetch all projects", async () => {
    const projects = [
      {
        id: "1",
        name: "Project 1",
        state: "active",
        description: "Project 1 description",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        customerId: "customer1",
        employeeId: "employee1",
      },
      {
        id: "2",
        name: "Project 2",
        state: "completed",
        description: "Project 2 description",
        startDate: "2023-02-01",
        endDate: "2023-11-30",
        customerId: "customer2",
        employeeId: "employee2",
      },
    ];
    (getAllProjects as Mock).mockReturnValue(projects);
    const result = await fetchAllProjects(callback);
    expect(getAllProjects).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(projects);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("Test msg");
    (getAllProjects as Mock).mockRejectedValue(error);
    const result = await fetchAllProjects(callback);
    expect(getAllProjects).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching projects: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
