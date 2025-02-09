vi.mock("react", () => ({
  useState: vi.fn(),
  useEffect: vi.fn(),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { useState } from "react";
import SelectCustomerForm from "./SelectCustomerForm";

describe("SelectCustomerForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const mockCustomerIds = ["customer1", "customer2", "customer3"];
    (useState as Mock).mockReturnValue([mockCustomerIds]);
  });
  it("check correct texts: title, label, select options, buttonText", () => {
    const mockOnSubmit = vi.fn();
    render(<SelectCustomerForm buttonText="Submit" onSubmit={mockOnSubmit} />);

    const formTitle = screen.getByText("Select Customer");
    expect(formTitle).toBeInTheDocument();

    const formSelect = screen.getByLabelText("Customer ID");
    expect(formSelect).toBeInTheDocument();
    expect(formSelect).toHaveAttribute("name", "customerId");

    const defaultOption = screen
      .queryAllByRole("option")
      .find((option) => option.getAttribute("value") === "");
    const option1 = screen
      .queryAllByRole("option")
      .find((option) => option.getAttribute("value") === "customer1");
    const option2 = screen
      .queryAllByRole("option")
      .find((option) => option.getAttribute("value") === "customer2");
    const option3 = screen
      .queryAllByRole("option")
      .find((option) => option.getAttribute("value") === "customer3");

    expect(defaultOption).toBeInTheDocument();
    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
    expect(option3).toBeInTheDocument();

    const button = screen.queryByRole("button", { name: "Submit" });
    expect(button).toBeInTheDocument();
  });

  it("calls onSubmit when button is clicked", async () => {
    const mockOnSubmit = vi.fn();
    render(<SelectCustomerForm buttonText="Submit" onSubmit={mockOnSubmit} />);

    const select = screen.getByLabelText("Customer ID");
    fireEvent.change(select, { target: { value: "customer1" } });

    const button = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(button);

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled());
  });
  it("doesn't call onSubmit when: no selected option, then button click", async () => {
    const mockOnSubmit = vi.fn();
    render(<SelectCustomerForm buttonText="Submit" onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(button);

    await waitFor(() => expect(mockOnSubmit).not.toHaveBeenCalled());
  });

  it("shows error when: no selected option, then button click", async () => {
    const mockOnSubmit = vi.fn();
    render(<SelectCustomerForm buttonText="Submit" onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(button);

    const errorMessage = "Customer ID is required";

    await waitFor(() =>
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    );
  });
});
