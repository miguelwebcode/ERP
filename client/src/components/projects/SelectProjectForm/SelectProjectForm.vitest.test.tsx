vi.mock("react", () => ({
  useState: vi.fn(),
  useEffect: vi.fn(),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { useState } from "react";
import SelectProjectForm from "./SelectProjectForm";

describe("SelectProjectForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const mockProjectIds = ["project1", "project2", "project3"];
    (useState as Mock).mockReturnValue([mockProjectIds]);
  });

  it("check correct texts: title, label, select options, buttonText", () => {
    render(<SelectProjectForm buttonText="Submit" onSubmit={vi.fn()} />);

    const formTitle = screen.getByText("Select Project");
    expect(formTitle).toBeInTheDocument();

    const formSelect = screen.getByLabelText("Project ID");
    expect(formSelect).toBeInTheDocument();
    expect(formSelect).toHaveAttribute("name", "projectId");

    const defaultOption = screen
      .queryAllByRole("option")
      .find((option) => option.getAttribute("value") === "");
    expect(defaultOption).toBeInTheDocument();
    const option1 = screen
      .queryAllByRole("option")
      .find((option) => option.getAttribute("value") === "project1");
    expect(option1).toBeInTheDocument();
    const option2 = screen
      .queryAllByRole("option")
      .find((option) => option.getAttribute("value") === "project2");
    expect(option2).toBeInTheDocument();
    const option3 = screen
      .queryAllByRole("option")
      .find((option) => option.getAttribute("value") === "project3");
    expect(option3).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeInTheDocument();
  });

  it("calls onSubmit when: option selected, then button is clicked", async () => {
    const mockOnSubmit = vi.fn();
    render(<SelectProjectForm buttonText="Submit" onSubmit={mockOnSubmit} />);

    const formSelect = screen.getByLabelText("Project ID");
    fireEvent.change(formSelect, { target: { value: "project1" } });

    const button = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("doesn't call onSubmit when: no option selected, then button is clicked", async () => {
    const mockOnSubmit = vi.fn();
    render(<SelectProjectForm buttonText="Submit" onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it("shows error when: no selected option, then button click", async () => {
    render(<SelectProjectForm buttonText="Submit" onSubmit={vi.fn()} />);

    const button = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(button);

    const errorMessage = "Project ID is required";

    await waitFor(() => {
      const error = screen.getByText(errorMessage);
      expect(error).toBeInTheDocument();
    });
  });
});
