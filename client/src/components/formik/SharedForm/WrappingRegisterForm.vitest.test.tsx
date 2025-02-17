import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SharedForm from "./SharedForm";
import { RegisterFormValues } from "../../../types/form-values-types";
import { registerFormValidationSchema } from "../../../schemas";
import { CustomInput } from "../CustomInput/CustomInput";
import { CustomSelect } from "../CustomSelect/CustomSelect";

describe("SharedForm wrapping RegisterFormValues", () => {
  const initialValues: RegisterFormValues = {
    name: "name",
    role: "role1",
    email: "e@ma.il",
    password: "111222",
    confirmPassword: "111222",
  };
  const mockOnSubmit = vi.fn();
  const roles = [
    { id: "role1", value: "Role 1" },
    { id: "role2", value: "Role 2" },
    { id: "role3", value: "Role 3" },
  ];
  beforeEach(() => {
    render(
      <SharedForm<RegisterFormValues>
        initialValues={initialValues}
        validationSchema={registerFormValidationSchema}
        onSubmit={mockOnSubmit}
      >
        <CustomInput
          type="text"
          label="Name"
          name="name"
          placeholder="Enter your name"
        />
        <CustomSelect label="Role" name="role">
          <option value="" className="text-center">
            -- Select an option --
          </option>
          {roles.map((role) => {
            return (
              <option value={role.id} key={role.id}>
                {role.value}
              </option>
            );
          })}
        </CustomSelect>
        <CustomInput
          type="text"
          label="Email"
          name="email"
          placeholder="Enter your email"
        />
        <CustomInput
          type="password"
          label="Password"
          name="password"
          placeholder="Enter your password"
        />
        <CustomInput
          type="password"
          label="Confirm password"
          name="confirmPassword"
          placeholder="Enter your password again"
        />
        <button
          type="submit"
          className="w-4/5 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </SharedForm>
    );
  });
  it("shows correct initialValues", () => {
    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    expect(inputName.type).toBe("text");
    expect(inputName.value).toBe(initialValues.name);

    const selectRole = screen.getByLabelText("Role") as HTMLSelectElement;
    expect(selectRole.type).toBe("select-one");
    expect(selectRole.value).toBe(initialValues.role);

    const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
    expect(inputEmail.type).toBe("text");
    expect(inputEmail.value).toBe(initialValues.email);

    const inputPassword = screen.getByLabelText("Password") as HTMLInputElement;
    expect(inputPassword.type).toBe("password");
    expect(inputPassword.value).toBe(initialValues.password);

    const inputConfirmPassword = screen.getByLabelText(
      "Password"
    ) as HTMLInputElement;
    expect(inputConfirmPassword.type).toBe("password");
    expect(inputConfirmPassword.value).toBe(initialValues.confirmPassword);
  });
  it("calls onSubmit when form filled out and button clicked", async () => {
    const button = screen.getByRole("button", { name: /register/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
