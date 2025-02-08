vi.mock("formik", () => ({
  useField: vi.fn(),
}));

import { useField } from "formik";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { CustomSelect } from "./CustomSelect";

// <CustomSelect label="Project ID" name="projectId">
//   <option value="" className="text-center">
//     -- Select project ID --
//   </option>
//   {projectIds.map((id, index) => (
//     <option key={index} value={id}>
//       {id}
//     </option>
//   ))}
// </CustomSelect>

describe("CustomSelect", () => {
  it("label element has correct text, select element has correct name and id", () => {
    (useField as Mock).mockReturnValue([
      {
        name: "",
        value: "",
        onChange: vi.fn(),
        onBlur: vi.fn(),
      },
      {
        error: "",
        touched: false,
      },
    ]);
    render(
      <CustomSelect label="ID" name="id">
        <option value="">-- Select project ID --</option>
        <option value="1">First</option>
      </CustomSelect>
    );
    const labelElement = screen.getByText("ID");
    expect(labelElement).toBeInTheDocument();

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toHaveAttribute("name", "id");
    expect(selectElement).toHaveAttribute("id", "id");
  });

  it("first option has empty value, second option has correct value", () => {
    (useField as Mock).mockReturnValue([
      {
        name: "",
        value: "",
        onChange: vi.fn(),
        onBlur: vi.fn(),
      },
      {
        error: "",
        touched: false,
      },
    ]);
    render(
      <CustomSelect label="ID" name="id">
        <option value="">-- Select project ID --</option>
        <option value="1">First</option>
      </CustomSelect>
    );

    const firstOption = screen
      .getAllByRole("option")
      .find((option) => option.getAttribute("value") === "");

    expect(firstOption).toBeInTheDocument();

    const secondOption = screen
      .getAllByRole("option")
      .find((option) => option.getAttribute("value") === "1");

    expect(secondOption).toBeInTheDocument();
  });

  it("shows error", () => {
    (useField as Mock).mockReturnValue([
      {
        name: "",
        value: "",
        onChange: vi.fn(),
        onBlur: vi.fn(),
      },
      {
        error: "You must select an option",
        touched: true,
      },
    ]);
    render(
      <CustomSelect label="ID" name="id">
        <option value="">-- Select project ID --</option>
        <option value="1">First</option>
      </CustomSelect>
    );
    const errorMessage = screen.getByText("You must select an option");
    expect(errorMessage).toBeInTheDocument();
  });

  it("should have default value, select first option and change value, select default option and change value", () => {
    let mockSelectedValue = "";
    const mockOnChange = vi.fn((e: React.ChangeEvent<HTMLSelectElement>) => {
      mockSelectedValue = e.target.value;
    });
    (useField as Mock).mockReturnValue([
      {
        name: "",
        value: mockSelectedValue,
        onChange: mockOnChange,
        onBlur: vi.fn(),
      },
      {
        error: "",
        touched: false,
      },
    ]);
    render(
      <CustomSelect label="ID" name="id">
        <option value="">-- Select project ID --</option>
        <option value="1">First</option>
      </CustomSelect>
    );

    // Check that select element has default value
    const selectElement = screen.getByRole("combobox") as HTMLSelectElement;
    expect(selectElement.value).toBe("");

    // Check that first option is not selected
    const firstOption = screen.getByRole("option", {
      name: /first/i,
    }) as HTMLOptionElement;
    expect(firstOption.selected).toBe(false);

    // Change to first option
    fireEvent.change(selectElement, { target: { value: "1" } });

    // Check that select element has first option value
    expect(mockSelectedValue).toBe("1");

    // Select default option again
    fireEvent.change(selectElement, { target: { value: "" } });

    // Check if select has default value
    expect(mockSelectedValue).toBe("");
  });
});
