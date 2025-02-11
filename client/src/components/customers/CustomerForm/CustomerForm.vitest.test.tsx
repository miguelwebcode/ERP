import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CustomerForm from "./CustomerForm";

describe("CustomerForm", () => {
  it("shows correct texts title, button text, labels. shows empty fields", () => {
    render(
      <CustomerForm
        titleText="Title"
        submitButtonText="Button text"
        onSubmit={vi.fn()}
      />
    );
    const title = screen.getByRole("heading", { name: /title/i });
    expect(title).toBeInTheDocument();

    const inputAddress = screen.getByLabelText("Address") as HTMLInputElement;
    expect(inputAddress.value).toBe("");

    const inputCompany = screen.getByLabelText("Company") as HTMLInputElement;
    expect(inputCompany.value).toBe("");

    const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
    expect(inputEmail.value).toBe("");

    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    expect(inputName.value).toBe("");

    const inputPhone = screen.getByLabelText("Phone") as HTMLInputElement;
    expect(inputPhone.value).toBe("");

    const inputProject = screen.getByLabelText("Project") as HTMLInputElement;
    expect(inputProject.value).toBe("");

    const button = screen.getByText("Button text");
    expect(button).toBeInTheDocument();
  });

  it("shows error when empty form and button click", async () => {
    render(
      <CustomerForm
        titleText="Title"
        submitButtonText="Button text"
        onSubmit={vi.fn()}
      />
    );

    const button = screen.getByRole("button", {
      name: "Button text",
    });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      const errorAddress = screen.getByText("Address is required");
      expect(errorAddress).toBeInTheDocument();

      const errorCompany = screen.getByText("Company is required");
      expect(errorCompany).toBeInTheDocument();

      const errorEmail = screen.getByText("Email is required");
      expect(errorEmail).toBeInTheDocument();

      const errorName = screen.getByText("Name is required");
      expect(errorName).toBeInTheDocument();

      const errorPhone = screen.getByText("Phone is required");
      expect(errorPhone).toBeInTheDocument();

      const errorProject = screen.getByText("Project is required");
      expect(errorProject).toBeInTheDocument();
    });
  });
  it("doesn't call onSubmit when empty form and button click", async () => {
    const mockOnSubmit = vi.fn();
    render(
      <CustomerForm
        titleText="Title"
        submitButtonText="Button text"
        onSubmit={mockOnSubmit}
      />
    );

    const button = screen.getByRole("button", {
      name: "Button text",
    });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
  it("fields and button are disabled when arg canBeDisabled equals true", () => {
    vi.mock("../../../stores/app-store", () => ({
      useAppStore: () => "",
    }));
    render(
      <CustomerForm
        titleText="Title"
        submitButtonText="Button text"
        onSubmit={vi.fn()}
        canBeDisabled={true}
      />
    );
    const inputAddress = screen.getByLabelText("Address") as HTMLInputElement;
    expect(inputAddress.disabled).toBe(true);
    const inputCompany = screen.getByLabelText("Company") as HTMLInputElement;
    expect(inputCompany.disabled).toBe(true);
    const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
    expect(inputEmail.disabled).toBe(true);
    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    expect(inputName.disabled).toBe(true);
    const inputPhone = screen.getByLabelText("Phone") as HTMLInputElement;
    expect(inputPhone.disabled).toBe(true);
    const inputProject = screen.getByLabelText("Project") as HTMLInputElement;
    expect(inputProject.disabled).toBe(true);
    const button = screen.getByText("Button text") as HTMLButtonElement;
    expect(button).toBeInTheDocument();
    expect(button.disabled).toBe(true);
  });
  it("doesn't call onSubmit when button is disabled and button is clicked", async () => {
    vi.mock("../../../stores/app-store", () => ({
      useAppStore: () => "",
    }));
    const mockOnSubmit = vi.fn();
    render(
      <CustomerForm
        titleText="Title"
        submitButtonText="Button text"
        onSubmit={mockOnSubmit}
        canBeDisabled={true}
      />
    );

    const button = screen.getByText("Button text") as HTMLButtonElement;
    expect(button).toBeInTheDocument();
    expect(button.disabled).toBe(true);

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
