vi.mock("react", () => ({
  useState: vi.fn(),
  useEffect: (cb: () => void) => cb(),
  useRef: vi.fn(),
  useMemo: () => false,
}));
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { AddProjectView } from "./AddProjectView";
import { useState, useRef } from "react";
import * as appStore from "../../../stores/app-store";
import { FormikProps } from "formik";
import { ProjectFormValues } from "../../../types/form-values-types";
import React from "react";
import { Project } from "../../../types";
import * as projectsRepository from "../../../services/projects/repository/projectsRepository";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

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
  it("creates new project successfully", async () => {
    vi.spyOn(projectsRepository, "handleCreateProject");
    const isRenderDone = true;
    const setIsRenderDone = vi.fn();
    (useState as Mock).mockReturnValueOnce([isRenderDone, setIsRenderDone]);
    const mockStore = { setSelectedProjectId: vi.fn() };
    (appStore.useAppStore as unknown as Mock).mockImplementationOnce(
      (selector) => selector(mockStore)
    );
    // const formikRef = { current: true };
    // The previous mocked ref was not a valid ref, do it this way
    // const formikRef = React.createRef();
    const formikRef = { current: true } as React.MutableRefObject<boolean>;

    (useRef as Mock).mockReturnValueOnce(formikRef);

    render(<AddProjectView />);

    const projectData: Project = {
      name: "Demo Project",
      description: "A sample project used as dummy data.",
      customerId: "dummy-customer-001",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      state: "pending",
      developer: "Developer Name",
      createdAt: "2025-01-01T00:00:00Z",
    };

    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    expect(inputName).toBeInTheDocument();
    expect(inputName.value).toBe("");
    fireEvent.change(inputName, { target: { value: projectData.name } });

    const inputDescription = screen.getByLabelText(
      "Description"
    ) as HTMLInputElement;
    expect(inputDescription).toBeInTheDocument();
    expect(inputDescription.value).toBe("");
    fireEvent.change(inputDescription, {
      target: { value: projectData.description },
    });

    const inputCustomerId = screen.getByLabelText(
      "Customer ID"
    ) as HTMLInputElement;
    expect(inputCustomerId).toBeInTheDocument();
    expect(inputCustomerId.value).toBe("");
    fireEvent.change(inputCustomerId, {
      target: { value: projectData.customerId },
    });

    const inputAssignedDeveloper = screen.getByLabelText(
      "Assigned Developer"
    ) as HTMLInputElement;
    expect(inputAssignedDeveloper).toBeInTheDocument();
    expect(inputAssignedDeveloper.value).toBe("");
    fireEvent.change(inputAssignedDeveloper, {
      target: { value: projectData.developer },
    });

    const selectProjectState = screen.getByLabelText(
      "Project State"
    ) as HTMLSelectElement;
    expect(selectProjectState).toBeInTheDocument();
    expect(selectProjectState.value).toBe("");
    fireEvent.change(selectProjectState, {
      target: { value: projectData.state },
    });

    const inputStartDate = screen.getByLabelText(
      "Start Date"
    ) as HTMLInputElement;
    expect(inputStartDate).toBeInTheDocument();
    expect(inputStartDate.value).toBe("");
    fireEvent.change(inputStartDate, {
      target: { value: projectData.startDate },
    });

    const inputEndDate = screen.getByLabelText("End Date") as HTMLInputElement;
    expect(inputEndDate).toBeInTheDocument();
    expect(inputEndDate.value).toBe("");
    fireEvent.change(inputEndDate, {
      target: { value: projectData.endDate },
    });

    const button = screen.getByText("CREATE PROJECT");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    await waitFor(async () => {
      const projectsRef = collection(db, "projects");
      const q = query(
        projectsRef,
        where("customerId", "==", projectData.customerId)
      );
      const querySnapshot = await getDocs(q);
      const documentExists = !querySnapshot.empty;
      expect(documentExists).toBe(true);
      expect(projectsRepository.handleCreateProject).toHaveBeenCalled();

      const deletionPromises: Promise<void>[] = [];
      querySnapshot.forEach((doc) => {
        deletionPromises.push(deleteDoc(doc.ref));
      });
      await Promise.all(deletionPromises);
    });
  });
});
