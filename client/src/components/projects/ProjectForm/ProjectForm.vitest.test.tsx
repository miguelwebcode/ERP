import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import ProjectForm from "./ProjectForm";
import { useAppStore } from "../../../stores/app-store";

describe("ProjectForm", () => {
  it("shows correct texts: title, button text, labels. shows empty fields", () => {
    render(
      <ProjectForm
        titleText="Title"
        submitButtonText="Submit"
        onSubmit={vi.fn()}
      />
    );

    const title = screen.getByText("Title");
    expect(title).toBeInTheDocument();

    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    expect(inputName.value).toBe("");

    const inputDescription = screen.getByLabelText(
      "Description"
    ) as HTMLInputElement;
    expect(inputDescription.value).toBe("");

    const inputCustomerId = screen.getByLabelText(
      "Customer ID"
    ) as HTMLInputElement;
    expect(inputCustomerId.value).toBe("");

    const inputAssignedDeveloper = screen.getByLabelText(
      "Assigned Developer"
    ) as HTMLInputElement;
    expect(inputAssignedDeveloper.value).toBe("");

    const inputProjectState = screen.getByLabelText(
      "Project State"
    ) as HTMLSelectElement;
    expect(inputProjectState.value).toBe("");

    const inputStartDate = screen.getByLabelText(
      "Start Date"
    ) as HTMLInputElement;
    expect(inputStartDate.value).toBe("");

    const inputEndDate = screen.getByLabelText("End Date") as HTMLInputElement;
    expect(inputEndDate.value).toBe("");

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeInTheDocument();
  });

  it("shows errors when form is empty and button is clicked", async () => {
    render(
      <ProjectForm
        titleText="Title"
        submitButtonText="Submit"
        onSubmit={vi.fn()}
      />
    );
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      const errorName = screen.getByText("Name is required");
      expect(errorName).toBeInTheDocument();
      const errorDescription = screen.getByText("Description is required");
      expect(errorDescription).toBeInTheDocument();
      const errorCustomerId = screen.getByText("Customer ID is required");
      expect(errorCustomerId).toBeInTheDocument();
      const errorAssignedDeveloper = screen.getByText(
        "Project's developer is required"
      );
      expect(errorAssignedDeveloper).toBeInTheDocument();
      const errorProjectState = screen.getByText("Project's state is required");
      expect(errorProjectState).toBeInTheDocument();
      const errorStartDate = screen.getByText("Start date is required");
      expect(errorStartDate).toBeInTheDocument();
      const errorEndDate = screen.getByText("End date is required");
      expect(errorEndDate).toBeInTheDocument();
    });
  });

  it("doesn't call onSubmit when empty form and button is clicked", async () => {
    const mockOnSubmit = vi.fn();
    render(
      <ProjectForm
        titleText="Title"
        submitButtonText="Submit"
        onSubmit={mockOnSubmit}
      />
    );

    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it("fields and button are disabled when arg canBeDisabled equals true", () => {
    vi.mock("../../stores/app-store", () => ({
      useAppStore: () => "",
    }));
    render(
      <ProjectForm
        titleText="Title"
        submitButtonText="Submit"
        onSubmit={vi.fn()}
        canBeDisabled={true}
      />
    );

    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    expect(inputName).toBeInTheDocument();
    expect(inputName.disabled).toBe(true);

    const inputDescription = screen.getByLabelText(
      "Description"
    ) as HTMLInputElement;
    expect(inputDescription).toBeInTheDocument();
    expect(inputDescription.disabled).toBe(true);

    const inputCustomerId = screen.getByLabelText(
      "Customer ID"
    ) as HTMLInputElement;
    expect(inputCustomerId).toBeInTheDocument();
    expect(inputCustomerId.disabled).toBe(true);

    const inputAssignedDeveloper = screen.getByLabelText(
      "Assigned Developer"
    ) as HTMLInputElement;
    expect(inputAssignedDeveloper).toBeInTheDocument();
    expect(inputAssignedDeveloper.disabled).toBe(true);

    const inputProjectState = screen.getByLabelText(
      "Project State"
    ) as HTMLSelectElement;
    expect(inputProjectState).toBeInTheDocument();
    expect(inputProjectState.disabled).toBe(true);

    const inputStartDate = screen.getByLabelText(
      "Start Date"
    ) as HTMLInputElement;
    expect(inputStartDate).toBeInTheDocument();
    expect(inputStartDate.disabled).toBe(true);

    const inputEndDate = screen.getByLabelText("End Date") as HTMLInputElement;
    expect(inputEndDate).toBeInTheDocument();
    expect(inputEndDate.disabled).toBe(true);

    const button = screen.getByRole("button", {
      name: "Submit",
    }) as HTMLButtonElement;
    expect(button).toBeInTheDocument();
    expect(button.disabled).toBe(true);
  });

  it("doesn't call onSubmit when button disabled and button is clicked", async () => {
    const mockOnSubmit = vi.fn();
    render(
      <ProjectForm
        titleText="Title"
        submitButtonText="Submit"
        onSubmit={mockOnSubmit}
        canBeDisabled
      />
    );

    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
