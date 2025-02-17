import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SharedForm from "./SharedForm";
import { SelectProjectFormValues } from "../../../types/form-values-types";
import { selectProjectFormValidationSchema } from "../../../schemas";
import { CustomSelect } from "../CustomSelect/CustomSelect";

describe("SharedForm wrapping SelectProjectFormValues", () => {
  const initialValues: SelectProjectFormValues = {
    projectId: "1",
  };
  const mockOnSubmit = vi.fn();
  const projectIds = ["1", "2", "3"];
  beforeEach(() => {
    render(
      <SharedForm<SelectProjectFormValues>
        initialValues={initialValues}
        validationSchema={selectProjectFormValidationSchema}
        onSubmit={mockOnSubmit}
      >
        <CustomSelect label="Project ID" name="projectId">
          <option value="" className="text-center">
            -- Select project ID --
          </option>
          {projectIds.map((id, index) => (
            <option key={index} value={id}>
              {id}
            </option>
          ))}{" "}
          <button
            type="submit"
            className="w-4/5 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
          >
            "Submit"
          </button>
        </CustomSelect>
      </SharedForm>
    );
  });
  it("shows correct initialValues", () => {
    const selectProjectId = screen.getByLabelText(
      "Project ID"
    ) as HTMLSelectElement;
    expect(selectProjectId).toBeInTheDocument();
    expect(selectProjectId.type).toBe("select-one");
    expect(selectProjectId.value).toBe(initialValues.projectId);
  });
  it("calls onSubmit when form filled out and button clicked", async () => {
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
