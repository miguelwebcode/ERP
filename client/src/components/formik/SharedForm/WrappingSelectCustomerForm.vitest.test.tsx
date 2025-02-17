import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SharedForm from "./SharedForm";
import { SelectCustomerFormValues } from "../../../types/form-values-types";
import { selectCustomerFormValidationSchema } from "../../../schemas";
import { CustomSelect } from "../CustomSelect/CustomSelect";

describe("SharedForm wrapping SelectCustomerFormValues", () => {
  const initialValues: SelectCustomerFormValues = {
    customerId: "1",
  };
  const mockOnSubmit = vi.fn();
  const customerIds = ["1", "2", "3"];
  beforeEach(() => {
    render(
      <SharedForm<SelectCustomerFormValues>
        initialValues={initialValues}
        validationSchema={selectCustomerFormValidationSchema}
        onSubmit={mockOnSubmit}
      >
        <CustomSelect label="Customer ID" name="customerId">
          <option value="" className="text-center">
            -- Select customer ID --
          </option>
          {customerIds.map((id, index) => (
            <option key={index} value={id}>
              {id}
            </option>
          ))}
        </CustomSelect>
        <button
          type="submit"
          className="w-4/5 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </SharedForm>
    );
  });
  it("shows correct initialValues", () => {
    const selectCustomerId = screen.getByLabelText(
      "Customer ID"
    ) as HTMLSelectElement;
    expect(selectCustomerId).toBeInTheDocument();
    expect(selectCustomerId.value).toBe("1");
  });
  it("calls onSubmit when: option selected and button is clicked", async () => {
    const selectCustomerId = screen.getByLabelText(
      "Customer ID"
    ) as HTMLSelectElement;
    expect(selectCustomerId).toBeInTheDocument();
    expect(selectCustomerId.value).toBe("1");

    const button = screen.getByRole("button", { name: /subm/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
