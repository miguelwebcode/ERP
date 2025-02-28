import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import * as appStore from "../../../stores/app-store";
import { useState, useRef, act } from "react";
import { EditProjectView } from "./EditProjectView";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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
    expect(selectProjectId.disabled).toBe(false);
    // SELECT PROJECT ID
    act(() => {
      fireEvent.change(selectProjectId, { target: { value: projectIds[0] } });
    });
    expect(selectProjectId.value).toBe(projectIds[0]);

    const buttonSelectProject = screen.getByRole("button", {
      name: /fetch project/i,
    }) as HTMLButtonElement;
    // FETCH PROJECT
    act(() => {
      fireEvent.click(buttonSelectProject);
    });

    await waitFor(() => {
      expect(buttonSelectProject).toBeInTheDocument();
      expect(buttonSelectProject.disabled).toBe(false);
    });
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
    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    const inputDescription = screen.getByLabelText(
      "Description"
    ) as HTMLInputElement;

    const inputAssignedDeveloper = screen.getByLabelText(
      "Assigned Developer"
    ) as HTMLInputElement;
    const selectProjectState = screen.getByLabelText(
      "Project State"
    ) as HTMLSelectElement;
    const inputStartDate = screen.getByLabelText(
      "Start Date"
    ) as HTMLInputElement;
    const inputEndDate = screen.getByLabelText("End Date") as HTMLInputElement;
    const buttonUpdateProject = screen.getByRole("button", {
      name: /update project/i,
    });
    await waitFor(() => {
      expect(inputName).toBeInTheDocument();
      expect(inputName.value).toBe(projectData.name);

      expect(inputDescription).toBeInTheDocument();
      expect(inputDescription.value).toBe(projectData.description);

      expect(inputCustomerId).toBeInTheDocument();
      expect(inputCustomerId.value).toBe(projectData.customerId);

      expect(inputAssignedDeveloper).toBeInTheDocument();
      expect(inputAssignedDeveloper.value).toBe(projectData.developer);

      expect(selectProjectState).toBeInTheDocument();
      expect(selectProjectState.value).toBe(projectData.state);

      expect(inputStartDate).toBeInTheDocument();
      expect(inputStartDate.value).toBe(projectData.startDate);

      expect(inputEndDate).toBeInTheDocument();
      expect(inputEndDate.value).toBe(projectData.endDate);
      expect(buttonUpdateProject).toBeInTheDocument();
    });

    const newCustomerId = "dummy-customerId-1";

    // CHANGE CUSTOMER ID VALUE TO NEW CUSTOMER ID
    act(() => {
      fireEvent.change(inputCustomerId, {
        target: { value: newCustomerId },
      });
    });

    await waitFor(() => {
      expect(inputCustomerId.value).toBe(newCustomerId);
    });
    // UPDATE CUSTOMER ID
    act(() => {
      fireEvent.click(buttonUpdateProject);
    });
    // Check value updated

    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("customerId", "==", newCustomerId));
    await waitFor(async () => {
      const querySnapshot = await getDocs(q);
      expect(querySnapshot.empty).toBe(false);

      const updatePromises: Promise<void>[] = [];
      querySnapshot.forEach((doc) => {
        updatePromises.push(
          updateDoc(doc.ref, { customerId: projectData.customerId })
        );
      });
      await Promise.all(updatePromises);
    });
  });
});
