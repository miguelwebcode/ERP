import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import * as appStore from "../../../stores/app-store";
import { useState, useRef } from "react";
import { EditProjectView } from "./EditProjectView";

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
});
