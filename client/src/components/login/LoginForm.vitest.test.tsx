vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth/auth";

describe("LoginForm", () => {
  //   beforeEach(() => {
  //     vi.clearAllMocks();
  //   });

  it("shows correct title, labels, button texts, inputs empty", () => {
    const mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    render(<LoginForm />);

    const title = screen.getByRole("heading", { name: "Login" });
    expect(title).toBeInTheDocument();

    const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
    expect(inputEmail).toBeInTheDocument();
    expect(inputEmail.value).toBe("");

    const inputPassword = screen.getByLabelText("Password") as HTMLInputElement;
    expect(inputPassword).toBeInTheDocument();
    expect(inputPassword.value).toBe("");

    const buttonLogin = screen.getByRole("button", { name: /login/i });
    expect(buttonLogin).toBeInTheDocument();

    const textBelow = screen.getByText(/Don't have an account/i);
    expect(textBelow).toBeInTheDocument();

    const buttonGoToRegister = screen.getByRole("button", {
      name: /register/i,
    });
    expect(buttonGoToRegister).toBeInTheDocument();
  });

  it("shows errors when form is empty and login button clicked", async () => {
    render(<LoginForm />);

    const buttonLogin = screen.getByRole("button", { name: /login/i });
    expect(buttonLogin).toBeInTheDocument();
    fireEvent.click(buttonLogin);
    await waitFor(() => {
      const errorEmail = screen.getByText("Email is required");
      expect(errorEmail).toBeInTheDocument();

      const errorPassword = screen.getByText("Password is required");
      expect(errorPassword).toBeInTheDocument();
    });
  });
  it("Empty credentials, Login button enabled, doesn't call handleSubmit", async () => {
    vi.mock("../../services/auth/auth", () => ({
      login: vi.fn(),
    }));

    const mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);

    render(<LoginForm />);

    const buttonLogin = screen.getByRole("button", {
      name: /login/i,
    }) as HTMLButtonElement;
    expect(buttonLogin).toBeInTheDocument();
    expect(buttonLogin.disabled).toBe(false);

    fireEvent.click(buttonLogin);

    await waitFor(() => {
      expect(login).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
  it("register button calls navigate function to register view", async () => {
    const mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);

    render(<LoginForm />);

    const buttonGoToRegister = screen.getByRole("button", {
      name: /register/i,
    });
    fireEvent.click(buttonGoToRegister);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/register");
    });
  });
});
