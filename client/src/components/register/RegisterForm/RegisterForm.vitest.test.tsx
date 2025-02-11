vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";

describe("RegisterForm", () => {
  it("shows correct title, labels, button texts, inputs empty", () => {
    const mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    render(<RegisterForm />);

    const title = screen.getByRole("heading", { name: "Register" });
    expect(title).toBeInTheDocument();

    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    expect(inputName).toBeInTheDocument();
    expect(inputName.value).toBe("");

    const inputRole = screen.getByLabelText("Role") as HTMLSelectElement;
    expect(inputRole).toBeInTheDocument();
    expect(inputRole.value).toBe("");

    const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
    expect(inputEmail).toBeInTheDocument();
    expect(inputEmail.value).toBe("");

    const inputPassword = screen.getByLabelText("Password") as HTMLInputElement;
    expect(inputPassword).toBeInTheDocument();
    expect(inputPassword.value).toBe("");

    const inputConfirmPassword = screen.getByLabelText(
      /confirm pass/i
    ) as HTMLInputElement;
    expect(inputConfirmPassword).toBeInTheDocument();
    expect(inputConfirmPassword.value).toBe("");

    const buttonRegister = screen.getByRole("button", { name: /register/i });
    expect(buttonRegister).toBeInTheDocument();

    const textBelow = screen.getByText(/have an account/i);
    expect(textBelow).toBeInTheDocument();

    const buttonGoToLogin = screen.getByRole("button", {
      name: /Login/i,
    });
    expect(buttonGoToLogin).toBeInTheDocument();
  });

  it("shows errors when form is empty and register button is clicked", async () => {
    const mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    render(<RegisterForm />);

    const buttonRegister = screen.getByRole("button", { name: /register/i });
    fireEvent.click(buttonRegister);

    await waitFor(() => {
      const errorName = screen.getByText("Name is required");
      expect(errorName).toBeInTheDocument();
      const errorRole = screen.getByText("Role is required");
      expect(errorRole).toBeInTheDocument();
      const errorEmail = screen.getByText("Email is required");
      expect(errorEmail).toBeInTheDocument();
      const errorPassword = screen.getByText("Password required");
      expect(errorPassword).toBeInTheDocument();
      const errorConfirmPassword = screen.getByText(
        "Confirm password required"
      );
      expect(errorConfirmPassword).toBeInTheDocument();
    });
  });

  it("empty credentials, register button is enabled, doesn't call navigate to root route", async () => {
    const mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    render(<RegisterForm />);

    const buttonRegister = screen.getByRole("button", {
      name: /register/i,
    }) as HTMLButtonElement;
    expect(buttonRegister).toBeInTheDocument();
    expect(buttonRegister.disabled).toBe(false);

    fireEvent.click(buttonRegister);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith("/");
    });
  });

  it("login button calls navigate function to login view", async () => {
    const mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    render(<RegisterForm />);

    const buttonGoToLogin = screen.getByRole("button", {
      name: /Login/i,
    });

    fireEvent.click(buttonGoToLogin);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
