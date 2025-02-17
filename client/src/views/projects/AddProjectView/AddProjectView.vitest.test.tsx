vi.mock("react", () => ({
  useState: vi.fn(),
  useEffect: (cb: () => void) => cb(),
  useRef: vi.fn(),
  useMemo: () => false,
}));
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { AddProjectView } from "./AddProjectView";
import { useState, useRef } from "react";
import * as appStore from "../../../stores/app-store";
import { FormikProps } from "formik";
import { ProjectFormValues } from "../../../types/form-values-types";

describe("AddCustomerView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(appStore, "useAppStore");
  });

  it("sets project id to empty string and sets isRenderDone to true on first render", async () => {
    let mockIsRenderDone = false;
    const mockSetIsRenderDone = vi.fn();
    (useState as Mock).mockReturnValue([mockIsRenderDone, mockSetIsRenderDone]);
    const mockStore = { setSelectedProjectId: vi.fn() };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockStore)
    );

    render(<AddProjectView />);
    await waitFor(() => {
      expect(mockStore.setSelectedProjectId).toHaveBeenCalledWith("");
      expect(mockSetIsRenderDone).toHaveBeenCalledWith(true);
      const title = screen.queryByText("NEW PROJECT");
      expect(title).not.toBeInTheDocument();
    });
  });

  it("renders ProjectForm with correct texts", async () => {
    let mockIsRenderDone = true;
    const mockSetIsRenderDone = vi.fn();
    (useState as Mock).mockReturnValue([mockIsRenderDone, mockSetIsRenderDone]);

    const mockFormikRef = {} as React.RefObject<FormikProps<ProjectFormValues>>;
    (useRef as Mock).mockReturnValue(mockFormikRef);

    render(<AddProjectView />);
    await waitFor(() => {
      const title = screen.getByRole("heading", { name: "NEW PROJECT" });
      expect(title).toBeInTheDocument();
      expect(title).toBeInTheDocument();

      const inputName = screen.getByLabelText("Name") as HTMLInputElement;
      expect(inputName).toBeInTheDocument();
      expect(inputName.value).toBe("");

      const inputDescription = screen.getByLabelText(
        "Description"
      ) as HTMLInputElement;
      expect(inputDescription).toBeInTheDocument();
      expect(inputDescription.value).toBe("");

      const inputCustomerId = screen.getByLabelText(
        "Customer ID"
      ) as HTMLInputElement;
      expect(inputCustomerId).toBeInTheDocument();
      expect(inputCustomerId.value).toBe("");

      const inputAssignedDeveloper = screen.getByLabelText(
        "Assigned Developer"
      ) as HTMLInputElement;
      expect(inputAssignedDeveloper).toBeInTheDocument();
      expect(inputAssignedDeveloper.value).toBe("");

      const selectProjectState = screen.getByLabelText(
        "Project State"
      ) as HTMLSelectElement;
      expect(selectProjectState).toBeInTheDocument();
      expect(selectProjectState.value).toBe("");

      const inputStartDate = screen.getByLabelText(
        "Start Date"
      ) as HTMLInputElement;
      expect(inputStartDate).toBeInTheDocument();
      expect(inputStartDate.value).toBe("");

      const inputEndDate = screen.getByLabelText(
        "End Date"
      ) as HTMLInputElement;
      expect(inputEndDate).toBeInTheDocument();
      expect(inputEndDate.value).toBe("");

      const button = screen.getByText("CREATE PROJECT");
      expect(button).toBeInTheDocument();
    });
  });
});
