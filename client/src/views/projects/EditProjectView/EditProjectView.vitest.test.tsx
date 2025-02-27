import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import * as appStore from "../../../stores/app-store";
import { useState, useRef, act } from "react";
import { EditProjectView } from "./EditProjectView";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

vi.mock("react", async () => {
  const actualReact = await vi.importActual("react");
  return {
    ...actualReact,
    useState: vi.fn(),
    useRef: vi.fn(),
  };
});

describe("EditProjectView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(appStore, "useAppStore");
  });

  it("sets project id to empty string and isRenderDone to true on first render", async () => {
    const mockIsRenderDone = false;
    const mockSetIsRenderDone = vi.fn();
    (useState as Mock).mockReturnValue([mockIsRenderDone, mockSetIsRenderDone]);

    const mockStore = {
      selectedProjectId: "",
      setSelectedProjectId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockStore)
    );

    render(<EditProjectView />);

    await waitFor(() => {
      expect(mockStore.setSelectedProjectId).toHaveBeenCalledWith("");
      expect(mockSetIsRenderDone).toHaveBeenCalledWith(true);
    });
  });

  it("shows correct texts, select project button is enabled, customer form fields and button are disabled", async () => {
    const mockIsRenderDone = true;
    const mockSetIsRenderDone = vi.fn();
    (useState as Mock).mockReturnValue([mockIsRenderDone, mockSetIsRenderDone]);

    const mockStore = {
      selectedProjectId: "",
      setSelectedProjectId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockStore)
    );

    const mockProjectIds = ["1", "2", "3"];
    const mockSetProjectIds = vi.fn();
    (useState as Mock).mockReturnValue([mockProjectIds, mockSetProjectIds]);

    (useRef as Mock).mockImplementation(() => ({ current: false }));

    render(<EditProjectView />);

    await waitFor(() => {
      // SelectCustomerForm texts

      const titleSelectCustomer = screen.getByRole("heading", {
        name: /select project/i,
      });
      expect(titleSelectCustomer).toBeInTheDocument();

      const selectProjectId = screen.getByLabelText(
        /project id/i
      ) as HTMLSelectElement;
      expect(selectProjectId.value).toBe("");
      expect(selectProjectId.disabled).toBe(false);

      const buttonSelectProject = screen.getByRole("button", {
        name: /fetch project/i,
      }) as HTMLButtonElement;
      expect(buttonSelectProject).toBeInTheDocument();
      expect(buttonSelectProject.disabled).toBe(false);
    });

    // CustomerForm
    const titleCustomerForm = screen.getByRole("heading", {
      name: /Edit Project/i,
    });
    expect(titleCustomerForm).toBeInTheDocument();

    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    expect(inputName).toBeInTheDocument();
    expect(inputName.value).toBe("");
    expect(inputName.disabled).toBe(true);

    const inputDescription = screen.getByLabelText(
      "Description"
    ) as HTMLInputElement;
    expect(inputDescription).toBeInTheDocument();
    expect(inputDescription.value).toBe("");
    expect(inputDescription.disabled).toBe(true);

    const inputCustomerId = screen.getByLabelText(
      "Customer ID"
    ) as HTMLInputElement;
    expect(inputCustomerId).toBeInTheDocument();
    expect(inputCustomerId.value).toBe("");
    expect(inputCustomerId.disabled).toBe(true);

    const inputAssignedDeveloper = screen.getByLabelText(
      "Assigned Developer"
    ) as HTMLInputElement;
    expect(inputAssignedDeveloper).toBeInTheDocument();
    expect(inputAssignedDeveloper.value).toBe("");
    expect(inputAssignedDeveloper.disabled).toBe(true);

    const selectProjectState = screen.getByLabelText(
      "Project State"
    ) as HTMLSelectElement;
    expect(selectProjectState).toBeInTheDocument();
    expect(selectProjectState.value).toBe("");
    expect(selectProjectState.disabled).toBe(true);

    const inputStartDate = screen.getByLabelText(
      "Start Date"
    ) as HTMLInputElement;
    expect(inputStartDate).toBeInTheDocument();
    expect(inputStartDate.value).toBe("");
    expect(inputStartDate.disabled).toBe(true);

    const inputEndDate = screen.getByLabelText("End Date") as HTMLInputElement;
    expect(inputEndDate).toBeInTheDocument();
    expect(inputEndDate.value).toBe("");
    expect(inputEndDate.disabled).toBe(true);

    const buttonUpdateProject = screen.getByRole("button", {
      name: /update project/i,
    });
    expect(buttonUpdateProject).toBeInTheDocument();
  });
  it("fetch project, check texts on form, update project, check successful update", async () => {
    const isRenderDone = true;
    const setIsRenderDone = vi.fn();
    (useState as Mock).mockReturnValueOnce([isRenderDone, setIsRenderDone]);

    const mockStore = {
      selectedProjectId: "fa59a499-d803-4043-910e-2bf6e7bc64c7",
      setSelectedProjectId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockStore)
    );
    const projectIds = [
      "fa59a499-d803-4043-910e-2bf6e7bc64c7",
      "48e9a6a3-05e3-425f-99f2-73449567f05d",
    ];
    const setProjectIds = vi.fn();
    (useState as Mock).mockReturnValueOnce([projectIds, setProjectIds]);

    const formikRef = { current: true } as React.MutableRefObject<boolean>;
    (useRef as Mock).mockReturnValueOnce(formikRef);

    render(<EditProjectView />);

    const selectProjectId = screen.getByLabelText(
      /project id/i
    ) as HTMLSelectElement;
    expect(selectProjectId.value).toBe("");
    fireEvent.change(selectProjectId, { target: { value: projectIds[0] } });
    expect(selectProjectId.value).toBe(projectIds[0]);

    const buttonSelectProject = screen.getByRole("button", {
      name: /fetch project/i,
    }) as HTMLButtonElement;
    expect(buttonSelectProject).toBeInTheDocument();
    expect(buttonSelectProject.disabled).toBe(false);
    fireEvent.click(buttonSelectProject);

    const projectData = {
      projectId: "fa59a499-d803-4043-910e-2bf6e7bc64c7",
      name: "name1",
      description: "description1",
      customerId: "customer1",
      startDate: "2025-01-30",
      endDate: "2025-07-06",
      state: "pending",
      developer: "developer1",
      createdAt: "29/01/2025 19:38",
      updatedAt: "30/01/2025 15:27",
    };

    const inputCustomerId = screen.getByLabelText(
      "Customer ID"
    ) as HTMLInputElement;

    await waitFor(() => {
      const inputName = screen.getByLabelText("Name") as HTMLInputElement;
      expect(inputName).toBeInTheDocument();
      expect(inputName.value).toBe(projectData.name);

      const inputDescription = screen.getByLabelText(
        "Description"
      ) as HTMLInputElement;
      expect(inputDescription).toBeInTheDocument();
      expect(inputDescription.value).toBe(projectData.description);

      expect(inputCustomerId).toBeInTheDocument();
      expect(inputCustomerId.value).toBe(projectData.customerId);
      fireEvent.change(inputCustomerId, {
        target: { value: "dummy-customerId-1" },
      });
      expect(inputCustomerId.value).toBe("dummy-customerId-1");

      const inputAssignedDeveloper = screen.getByLabelText(
        "Assigned Developer"
      ) as HTMLInputElement;
      expect(inputAssignedDeveloper).toBeInTheDocument();
      expect(inputAssignedDeveloper.value).toBe(projectData.developer);

      const selectProjectState = screen.getByLabelText(
        "Project State"
      ) as HTMLSelectElement;
      expect(selectProjectState).toBeInTheDocument();
      expect(selectProjectState.value).toBe(projectData.state);

      const inputStartDate = screen.getByLabelText(
        "Start Date"
      ) as HTMLInputElement;
      expect(inputStartDate).toBeInTheDocument();
      expect(inputStartDate.value).toBe(projectData.startDate);

      const inputEndDate = screen.getByLabelText(
        "End Date"
      ) as HTMLInputElement;
      expect(inputEndDate).toBeInTheDocument();
      expect(inputEndDate.value).toBe(projectData.endDate);
    });

    const buttonUpdateProject = screen.getByRole("button", {
      name: /update project/i,
    });
    expect(buttonUpdateProject).toBeInTheDocument();
    fireEvent.click(buttonUpdateProject);
    // Check value updated
    await waitFor(async () => {
      const projectsRef = collection(db, "projects");
      const q = query(
        projectsRef,
        where("customerId", "==", "dummy-customerId-1")
      );
      const querySnapshot = await getDocs(q);
      expect(querySnapshot.empty).toBe(false);
    });
    // Set customerId to previous value
    fireEvent.change(inputCustomerId, {
      target: { value: projectData.customerId },
    });
    fireEvent.click(buttonUpdateProject);

    await waitFor(async () => {
      const projectsRef = collection(db, "projects");
      const q = query(
        projectsRef,
        where("customerId", "==", projectData.customerId)
      );
      const querySnapshot = await getDocs(q);
      expect(querySnapshot.empty).toBe(false);
    });
  });
});
