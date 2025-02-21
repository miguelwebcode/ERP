import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { DeleteProjectView } from "./DeleteProjectView";
import * as appStore from "../../../stores/app-store";
import * as projectService from "../../../services/projectsService";
import { useState, useRef } from "react";

vi.mock("react", async () => {
  const actualReact = await vi.importActual("react");
  return {
    ...actualReact,
    useState: vi.fn(),
    useRef: vi.fn(),
  };
});
describe("DeleteProjectView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(appStore, "useAppStore");
    vi.spyOn(projectService, "fetchProject");
  });

  it("sets project id to empty string on first render", async () => {
    const mockSelectedProject = {};
    const mockSetSelectedProject = vi.fn();
    (useState as Mock).mockReturnValue([
      mockSelectedProject,
      mockSetSelectedProject,
    ]);

    const mockAppStore = {
      selectedProjectId: "",
      setSelectedProjectId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockAppStore)
    );

    // const mockFetchProject = vi.fn();
    (useRef as Mock).mockImplementation(() => ({ current: true }));

    const mockProjectIds = ["1", "2", "3"];
    const mockSetProjectIds = vi.fn();
    (useState as Mock).mockReturnValue([mockProjectIds, mockSetProjectIds]);
    render(<DeleteProjectView />);

    await waitFor(() => {
      expect(mockAppStore.setSelectedProjectId).toHaveBeenCalledWith("");
    });
  });

  it("calls fetchProject on second render", async () => {
    const mockSelectedProject = {};
    const mockSetSelectedProject = vi.fn();
    (useState as unknown as Mock).mockReturnValue([
      mockSelectedProject,
      mockSetSelectedProject,
    ]);

    const mockAppStore = {
      selectedProjectId: "1",
      setSelectedProjectId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockAppStore)
    );

    (useRef as Mock).mockImplementation(() => ({ current: false }));

    const mockProjectIds = ["1", "2", "3"];
    const mockSetProjectIds = vi.fn();
    (useState as Mock).mockReturnValue([mockProjectIds, mockSetProjectIds]);

    render(<DeleteProjectView />);

    await waitFor(() => {
      expect(projectService.fetchProject).toHaveBeenCalled();
    });
  });

  it("shows correct select project form texts, doesn't show delete project card", async () => {
    const mockSelectedProject = {};
    const mockSetSelectedProject = vi.fn();
    (useState as unknown as Mock).mockReturnValue([
      mockSelectedProject,
      mockSetSelectedProject,
    ]);

    const mockAppStore = {
      selectedProjectId: "",
      setSelectedProjectId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockAppStore)
    );

    (useRef as Mock).mockImplementation(() => ({ current: false }));

    const mockProjectIds = ["1", "2", "3"];
    const mockSetProjectIds = vi.fn();
    (useState as Mock).mockReturnValue([mockProjectIds, mockSetProjectIds]);

    render(<DeleteProjectView />);

    await waitFor(() => {
      const titleSelectProject = screen.getByRole("heading", {
        name: /select Project/i,
      });
      expect(titleSelectProject).toBeInTheDocument();

      const selectProjectId = screen.getByLabelText(
        /Project id/i
      ) as HTMLSelectElement;
      expect(selectProjectId.value).toBe("");

      const buttonSelectProject = screen.getByRole("button", {
        name: /fetch Project/i,
      });
      expect(buttonSelectProject).toBeInTheDocument();

      const buttonDeleteProject = screen.queryByRole("button", {
        name: /delete Project/i,
      });
      expect(buttonDeleteProject).not.toBeInTheDocument();
    });
  });

  it("shows correct texts for select project form and delete project card", async () => {
    const mockSelectedProject = {};
    const mockSetSelectedProject = vi.fn();
    (useState as unknown as Mock).mockReturnValue([
      mockSelectedProject,
      mockSetSelectedProject,
    ]);

    const mockAppStore = {
      selectedProjectId: "1",
      setSelectedProjectId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockAppStore)
    );

    (useRef as Mock).mockImplementation(() => ({ current: false }));

    const mockProjectIds = ["1", "2", "3"];
    const mockSetProjectIds = vi.fn();
    (useState as Mock).mockReturnValue([mockProjectIds, mockSetProjectIds]);

    render(<DeleteProjectView />);

    await waitFor(() => {
      // SelectProjectForm texts
      const titleSelectProject = screen.getByRole("heading", {
        name: /select Project/i,
      });
      expect(titleSelectProject).toBeInTheDocument();

      const selectProjectId = screen.getByLabelText(
        /Project id/i
      ) as HTMLSelectElement;
      expect(selectProjectId.value).toBe("");

      const buttonSelectProject = screen.getByRole("button", {
        name: /fetch Project/i,
      });
      expect(buttonSelectProject).toBeInTheDocument();

      //ProjectCard with delete button
      const fieldName = screen.getByText("Name");
      expect(fieldName).toBeInTheDocument();
      const fieldDescription = screen.getByText("Description");
      expect(fieldDescription).toBeInTheDocument();
      const fieldCustomerId = screen.getByText("Customer ID");
      expect(fieldCustomerId).toBeInTheDocument();
      const fieldDeveloper = screen.getByText("Developer");
      expect(fieldDeveloper).toBeInTheDocument();
      const fieldState = screen.getByText("State");
      expect(fieldState).toBeInTheDocument();
      const fieldStartDate = screen.getByText("Start Date");
      expect(fieldStartDate).toBeInTheDocument();
      const fieldEndDate = screen.getByText("End Date");
      expect(fieldEndDate).toBeInTheDocument();

      const buttonDeleteProject = screen.getByRole("button", {
        name: /delete Project/i,
      });
      expect(buttonDeleteProject).toBeInTheDocument();
    });
    /* 
     TODO: test con datos reales, emulators
    */
  });
});
