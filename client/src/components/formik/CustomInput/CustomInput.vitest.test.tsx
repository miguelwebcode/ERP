vi.mock("formik", () => ({
  useField: vi.fn(),
}));

import { describe, it, expect, vi, Mock } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CustomInput } from "./CustomInput";
import { useField } from "formik";

describe("CustomInput", () => {
  it("shows correct label value and input value", () => {
    // Mock del hook useField
    (useField as Mock).mockReturnValue([
      { name: "name", value: "Bart", onChange: vi.fn(), onBlur: vi.fn() }, // field
      { error: "", touched: false }, // meta
    ]);
    render(<CustomInput label="Test Label" name="name" type="input" />);
    expect(screen.getByText("Test Label"));
    const inputElement = screen.getByLabelText("Test Label");
    expect(inputElement).toHaveValue("Bart");
  });
  it("input has correct type value", () => {
    // Mock del hook useField
    (useField as Mock).mockReturnValue([
      { name: "name", value: "Bart", onChange: vi.fn(), onBlur: vi.fn() }, // field
      { error: "", touched: false }, // meta
    ]);
    render(<CustomInput label="Test Label" name="name" type="input" />);
    const inputElement = screen.getByLabelText("Test Label");
    expect(inputElement).toHaveAttribute("type", "input");
  });
  it("input has correct placeholder", () => {
    // Mock del hook useField
    (useField as Mock).mockReturnValue([
      { name: "name", value: "Bart", onChange: vi.fn(), onBlur: vi.fn() }, // field
      { error: "", touched: false }, // meta
    ]);
    render(
      <CustomInput
        label="Name"
        name="name"
        type="input"
        placeholder="Enter name"
      />
    );
    const inputElement = screen.getByPlaceholderText("Enter name");
    expect(inputElement).toBeDefined();
  });
  it("should be disabled when the 'disabled' prop is true", () => {
    // Mock del hook useField
    (useField as Mock).mockReturnValue([
      { name: "name", value: "Bart", onChange: vi.fn(), onBlur: vi.fn() }, // field
      { error: "", touched: false }, // meta
    ]);
    render(<CustomInput label="Name" name="name" type="input" disabled />);
    const inputElement = screen.getByLabelText("Name");
    expect(inputElement).toBeDisabled();

    fireEvent.change(inputElement, { target: { value: "Nuevo valor" } });
    expect(inputElement).toHaveValue("Bart");
    expect(inputElement).not.toHaveValue("Nuevo valor");
  });
  it("shows an error when error message has value and input is touched", () => {
    // Mock del hook useField
    (useField as Mock).mockReturnValue([
      { name: "name", value: "Bart", onChange: vi.fn(), onBlur: vi.fn() }, // field
      { error: "Name is required", touched: true }, // meta
    ]);
    render(<CustomInput label="Name" name="name" type="input" disabled />);
    const errorMessage = screen.getByText("Name is required");
    expect(errorMessage).toBeDefined();
    expect(errorMessage).toHaveClass("text-ds-accent1-500");
  });
});
