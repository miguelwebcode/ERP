import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SharedForm from "./SharedForm";
import { LoginFormValues } from "../../../types/form-values-types";
import { loginFormValidationSchema } from "../../../schemas";
import { CustomInput } from "../CustomInput/CustomInput";

describe("SharedForm wrapping LoginFormValues", () => {
  vi.mock("react-router-dom", () => ({
    useNavigate: vi.fn(),
  }));
  const mockOnSubmit = vi.fn();
  const initialValues: LoginFormValues = {
    email: "em@ail.com",
    password: "111222",
  };
  beforeEach(() => {
    render(
      <SharedForm<LoginFormValues>
        initialValues={initialValues}
        validationSchema={loginFormValidationSchema}
        onSubmit={mockOnSubmit}
      >
        <CustomInput
          label="Email"
          name="email"
          type="text"
          placeholder="Enter email"
        />
        <CustomInput
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
        />
        <button
          type="submit"
          className="w-4/5 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </SharedForm>
    );
  });
  it("shows correct initialValues", () => {
    const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
    expect(inputEmail).toBeInTheDocument();
    expect(inputEmail.type).toBe("text");
    expect(inputEmail.value).toBe(initialValues.email);

    const inputPassword = screen.getByLabelText("Password") as HTMLInputElement;
    expect(inputPassword).toBeInTheDocument();
    expect(inputPassword.type).toBe("password");
    expect(inputPassword.value).toBe(initialValues.password);
  });
  it("calls onSubmit when form filled out and button clicked", async () => {
    const button = screen.getByRole("button", { name: /login/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
