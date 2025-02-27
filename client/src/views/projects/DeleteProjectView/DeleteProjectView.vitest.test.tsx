import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { DeleteProjectView } from "./DeleteProjectView";
import * as appStore from "../../../stores/app-store";
import * as projectService from "../../../services/projects/service/projectsService";
import { useState, useRef } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

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

  it("retreives project data, shows it and deletes it when button clicked", async () => {
    const selectedProject = {
      projectId: "48e9a6a3-05e3-425f-99f2-73449567f05d",
      name: "name2",
      description: "description2",
      customerId: "customer2",
      startDate: "2025-01-29",
      endDate: "2025-04-28",
      state: "inProgress",
      developer: "developer2",
      createdAt: "29/01/2025 19:37",
    };
    const setSelectedProject = vi.fn();

    (useState as Mock).mockReturnValueOnce([
      selectedProject,
      setSelectedProject,
    ]);
    const projectIds = [
      "fa59a499-d803-4043-910e-2bf6e7bc64c7",
      "48e9a6a3-05e3-425f-99f2-73449567f05d",
    ];
    const selectedProjectId = projectIds[1];
    const setSelectedProjectId = vi.fn();
    const mockStore = { selectedProjectId, setSelectedProjectId };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockStore)
    );
    const isFirstRender = { current: false } as React.MutableRefObject<boolean>;
    (useRef as Mock).mockReturnValueOnce(isFirstRender);
    const setProjectIds = vi.fn();
    (useState as Mock).mockReturnValueOnce([projectIds, setProjectIds]);
    render(<DeleteProjectView />);

    const selectProjectId = screen.getByLabelText(
      /Project id/i
    ) as HTMLSelectElement;
    expect(selectProjectId.value).toBe("");
    fireEvent.change(selectProjectId, { target: { value: projectIds[0] } });
    expect(selectProjectId.value).toBe(projectIds[0]);

    const buttonSelectProject = screen.getByRole("button", {
      name: /fetch Project/i,
    });
    expect(buttonSelectProject).toBeInTheDocument();
    fireEvent.click(buttonSelectProject);
    const buttonDeleteProject = screen.getByRole("button", {
      name: /delete Project/i,
    });
    expect(buttonDeleteProject).toBeInTheDocument();

    await waitFor(() => {
      //ProjectCard with delete button
      const fieldName = screen.getByText("Name");
      expect(fieldName).toBeInTheDocument();
      const spanName = screen.getByTestId(/name/i);
      expect(spanName).toHaveTextContent(selectedProject.name);

      const fieldDescription = screen.getByText("Description");
      expect(fieldDescription).toBeInTheDocument();
      const spanDescription = screen.getByTestId(/description/i);
      expect(spanDescription).toHaveTextContent(selectedProject.description);

      const fieldCustomerId = screen.getByText("Customer ID");
      expect(fieldCustomerId).toBeInTheDocument();
      const spanCustomerId = screen.getByTestId(/customer id/i);
      expect(spanCustomerId).toHaveTextContent(selectedProject.customerId);

      const fieldDeveloper = screen.getByText("Developer");
      expect(fieldDeveloper).toBeInTheDocument();
      const spanDeveloper = screen.getByTestId(/developer/i);
      expect(spanDeveloper).toHaveTextContent(selectedProject.developer);

      const fieldState = screen.getByText("State");
      expect(fieldState).toBeInTheDocument();
      const spanState = screen.getByTestId(/state/i);
      expect(spanState).toHaveTextContent(selectedProject.state);

      const fieldStartDate = screen.getByText("Start Date");
      expect(fieldStartDate).toBeInTheDocument();
      const spanStartDate = screen.getByTestId(/start date/i);
      expect(spanStartDate).toHaveTextContent(selectedProject.startDate);

      const fieldEndDate = screen.getByText("End Date");
      expect(fieldEndDate).toBeInTheDocument();
      const spanEndDate = screen.getByTestId(/end date/i);
      expect(spanEndDate).toHaveTextContent(selectedProject.endDate);
    });

    fireEvent.click(buttonDeleteProject);

    await waitFor(async () => {
      // Check project deleted
      const projectsRef = collection(db, "projects");
      const q = query(
        projectsRef,
        where("projectId", "==", selectedProject.projectId)
      );
      const querySnapshotDelete = await getDocs(q);
      expect(querySnapshotDelete.empty).toBe(true);
      // Re-create same project
      await addDoc(projectsRef, selectedProject);
      const querySnapshotCreate = await getDocs(q);
      expect(querySnapshotCreate.empty).toBe(false);
    });
  });
});
