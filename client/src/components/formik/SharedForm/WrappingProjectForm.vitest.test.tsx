import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SharedForm from "./SharedForm";
import { ProjectFormValues } from "../../../types/form-values-types";
import { projectFormValidationSchema } from "../../../schemas";
import { CustomInput } from "../CustomInput/CustomInput";
import { CustomSelect } from "../CustomSelect/CustomSelect";

describe("SharedForm wrapping ProjectFormValues, happy paths", () => {
  const initialValues: ProjectFormValues = {
    name: "name",
    description: "description",
    customerId: "customerId",
    developer: "dev1",
    state: "pending",
    startDate: "2025-01-31",
    endDate: "2026-01-31",
  };
  const mockOnSubmit = vi.fn();
  const fieldDisabled = false;
  const projectStates = [
    { id: "pending", value: "Pending" },
    { id: "progress", value: "Progress" },
    { id: "done", value: "Done" },
  ];
  beforeEach(() => {
    render(
      <SharedForm<ProjectFormValues>
        initialValues={initialValues}
        validationSchema={projectFormValidationSchema}
        onSubmit={mockOnSubmit}
      >
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-8">Title</h1>
          <div className="flex flex-col md:flex-row md:gap-10">
            <div className="flex flex-col w-64">
              <CustomInput
                type="text"
                label="Name"
                name="name"
                placeholder="Enter project's name"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Description"
                name="description"
                placeholder="Enter project's description"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Customer ID"
                name="customerId"
                placeholder="Enter project's customer id"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Assigned Developer"
                name="developer"
                placeholder="Enter project's developer"
                disabled={fieldDisabled}
              />
            </div>
            <div className="flex flex-col w-fit">
              <CustomSelect
                label="Project State"
                name="state"
                disabled={fieldDisabled}
              >
                <option className="text-center" value="">
                  -- Select an option --
                </option>
                {projectStates.map((projectState) => {
                  return (
                    <option key={projectState.id} value={projectState.id}>
                      {projectState.value}
                    </option>
                  );
                })}
              </CustomSelect>
              <CustomInput
                type="date"
                label="Start Date"
                name="startDate"
                placeholder="Enter project's startDate"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="date"
                label="End Date"
                name="endDate"
                placeholder="Enter project's endDate"
                disabled={fieldDisabled}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-fit bg-blue-500 text-white mt-4 py-2 px-4 rounded hover:bg-blue-600 uppercase font-bold disabled:bg-gray-500"
            disabled={fieldDisabled}
          >
            Submit
          </button>
        </div>
      </SharedForm>
    );
  });
  it("shows correct initialValues", () => {
    const title = screen.getByText("Title");
    expect(title).toBeInTheDocument();

    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    expect(inputName.type).toBe("text");
    expect(inputName.value).toBe(initialValues.name);

    const inputDescription = screen.getByLabelText(
      "Description"
    ) as HTMLInputElement;
    expect(inputDescription.type).toBe("text");
    expect(inputDescription.value).toBe(initialValues.description);

    const inputCustomerId = screen.getByLabelText(
      "Customer ID"
    ) as HTMLInputElement;
    expect(inputCustomerId.type).toBe("text");
    expect(inputCustomerId.value).toBe(initialValues.customerId);

    const inputDeveloper = screen.getByLabelText(
      "Assigned Developer"
    ) as HTMLInputElement;
    expect(inputDeveloper.type).toBe("text");
    expect(inputDeveloper.value).toBe(initialValues.developer);

    const inputState = screen.getByLabelText(
      "Project State"
    ) as HTMLSelectElement;
    expect(inputState.type).toBe("select-one");
    expect(inputState.value).toBe(initialValues.state);

    const inpuStartDate = screen.getByLabelText(
      "Start Date"
    ) as HTMLInputElement;
    expect(inpuStartDate.type).toBe("date");
    expect(inpuStartDate.value).toBe(initialValues.startDate);

    const inpuEndDate = screen.getByLabelText("End Date") as HTMLInputElement;
    expect(inpuEndDate.type).toBe("date");
    expect(inpuEndDate.value).toBe(initialValues.endDate);
  });
  it("calls onSubmit when form filled out and button is clicked", async () => {
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});

describe("SharedForm wrapping ProjectFormValues, validate error messages", () => {
  const initialValues: ProjectFormValues = {
    name: "",
    description: "",
    customerId: "",
    developer: "",
    state: "",
    startDate: "",
    endDate: "",
  };
  const mockOnSubmit = vi.fn();
  const fieldDisabled = false;
  const projectStates = [
    { id: "pending", value: "Pending" },
    { id: "progress", value: "Progress" },
    { id: "done", value: "Done" },
  ];
  beforeEach(() => {
    render(
      <SharedForm<ProjectFormValues>
        initialValues={initialValues}
        validationSchema={projectFormValidationSchema}
        onSubmit={mockOnSubmit}
      >
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-8">Title</h1>
          <div className="flex flex-col md:flex-row md:gap-10">
            <div className="flex flex-col w-64">
              <CustomInput
                type="text"
                label="Name"
                name="name"
                placeholder="Enter project's name"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Description"
                name="description"
                placeholder="Enter project's description"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Customer ID"
                name="customerId"
                placeholder="Enter project's customer id"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Assigned Developer"
                name="developer"
                placeholder="Enter project's developer"
                disabled={fieldDisabled}
              />
            </div>
            <div className="flex flex-col w-fit">
              <CustomSelect
                label="Project State"
                name="state"
                disabled={fieldDisabled}
              >
                <option className="text-center" value="">
                  -- Select an option --
                </option>
                {projectStates.map((projectState) => {
                  return (
                    <option key={projectState.id} value={projectState.id}>
                      {projectState.value}
                    </option>
                  );
                })}
              </CustomSelect>
              <CustomInput
                type="date"
                label="Start Date"
                name="startDate"
                placeholder="Enter project's startDate"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="date"
                label="End Date"
                name="endDate"
                placeholder="Enter project's endDate"
                disabled={fieldDisabled}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-fit bg-blue-500 text-white mt-4 py-2 px-4 rounded hover:bg-blue-600 uppercase font-bold disabled:bg-gray-500"
            disabled={fieldDisabled}
          >
            Submit
          </button>
        </div>
      </SharedForm>
    );
  });
  it("shows correct error messages", async () => {
    const buttonSubmit = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(buttonSubmit);

    await waitFor(() => {
      const errorName = screen.getByText("Name is required");
      expect(errorName).toBeInTheDocument();

      const errorDescription = screen.getByText("Description is required");
      expect(errorDescription).toBeInTheDocument();

      const errorCustomerId = screen.getByText("Customer ID is required");
      expect(errorCustomerId).toBeInTheDocument();

      const errorStartDate = screen.getByText("Start date is required");
      expect(errorStartDate).toBeInTheDocument();

      const errorEndDate = screen.getByText("End date is required");
      expect(errorEndDate).toBeInTheDocument();

      const errorState = screen.getByText("Project's state is required");
      expect(errorState).toBeInTheDocument();

      const errorDeveloper = screen.getByText(
        "Project's developer is required"
      );
      expect(errorDeveloper).toBeInTheDocument();
    });
  });
});
