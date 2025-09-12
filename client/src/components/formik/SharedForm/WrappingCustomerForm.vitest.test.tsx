import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SharedForm from "./SharedForm";
import { CustomerFormValues } from "../../../types/form-values-types";
import { customerFormValidationSchema } from "../../../schemas";
import { CustomInput } from "../CustomInput/CustomInput";

describe("SharedForm wrapping CustomerFormValue, Happy paths", () => {
  const initialValues: CustomerFormValues = {
    address: "address",
    company: "company",
    email: "email@em.com",
    name: "name",
    phone: "123456789",
  };

  const mockOnSubmit = vi.fn();
  const fieldDisabled = false;
  beforeEach(() => {
    render(
      <SharedForm<CustomerFormValues>
        initialValues={initialValues}
        validationSchema={customerFormValidationSchema}
        onSubmit={mockOnSubmit}
      >
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-8">Title</h1>
          <div className="flex flex-col md:flex-row md:gap-10">
            <div className="flex flex-col w-fit">
              <CustomInput
                type="text"
                label="Address"
                name="address"
                placeholder="Enter address"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Company"
                name="company"
                placeholder="Enter company"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Email"
                name="email"
                placeholder="Enter email"
                disabled={fieldDisabled}
              />
            </div>
            <div className="flex flex-col w-fit">
              <CustomInput
                type="text"
                label="Name"
                name="name"
                placeholder="Enter name"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Phone"
                name="phone"
                placeholder="Enter phone"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Project"
                name="project"
                placeholder="Enter project"
                disabled={fieldDisabled}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-fit bg-blue-500 text-white mt-4 py-2 px-4 rounded hover:bg-blue-600 uppercase font-bold disabled:bg-gray-500"
            disabled={fieldDisabled}
          >
            Button text
          </button>
        </div>
      </SharedForm>
    );
  });
  it("shows correct initialValues", () => {
    const title = screen.getByRole("heading", { name: /title/i });
    expect(title).toBeInTheDocument();

    const inputAddress = screen.getByLabelText("Address") as HTMLInputElement;
    expect(inputAddress.value).toBe(initialValues.address);

    const inputCompany = screen.getByLabelText("Company") as HTMLInputElement;
    expect(inputCompany.value).toBe(initialValues.company);

    const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
    expect(inputEmail.value).toBe(initialValues.email);

    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    expect(inputName.value).toBe(initialValues.name);

    const inputPhone = screen.getByLabelText("Phone") as HTMLInputElement;
    expect(inputPhone.value).toBe(initialValues.phone);

    const button = screen.getByText("Button text");
    expect(button).toBeInTheDocument();
  });

  it("calls onSubmit when form filled out and button is clicked", async () => {
    const button = screen.getByText("Button text");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});

describe("SharedForm wrapping CustomerFormValue, validate error messages", () => {
  it("shows required error messages when form empty", async () => {
    const initialValues: CustomerFormValues = {
      address: "",
      company: "",
      email: "",
      name: "",
      phone: "",
    };

    const mockOnSubmit = vi.fn();
    const fieldDisabled = false;
    render(
      <SharedForm<CustomerFormValues>
        initialValues={initialValues}
        validationSchema={customerFormValidationSchema}
        onSubmit={mockOnSubmit}
      >
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-8">Title</h1>
          <div className="flex flex-col md:flex-row md:gap-10">
            <div className="flex flex-col w-fit">
              <CustomInput
                type="text"
                label="Address"
                name="address"
                placeholder="Enter address"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Company"
                name="company"
                placeholder="Enter company"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Email"
                name="email"
                placeholder="Enter email"
                disabled={fieldDisabled}
              />
            </div>
            <div className="flex flex-col w-fit">
              <CustomInput
                type="text"
                label="Name"
                name="name"
                placeholder="Enter name"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Phone"
                name="phone"
                placeholder="Enter phone"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Project"
                name="project"
                placeholder="Enter project"
                disabled={fieldDisabled}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-fit bg-blue-500 text-white mt-4 py-2 px-4 rounded hover:bg-blue-600 uppercase font-bold disabled:bg-gray-500"
            disabled={fieldDisabled}
          >
            Button text
          </button>
        </div>
      </SharedForm>
    );
    const button = screen.getByText("Button text");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      const errorRequiredAddress = screen.getByText("Address is required");
      expect(errorRequiredAddress).toBeInTheDocument();

      const errorRequiredCompany = screen.getByText("Company is required");
      expect(errorRequiredCompany).toBeInTheDocument();
      const errorRequiredEmail = screen.getByText("Email is required");
      expect(errorRequiredEmail).toBeInTheDocument();
      const errorRequiredName = screen.getByText("Name is required");
      expect(errorRequiredName).toBeInTheDocument();
      const errorRequiredPhone = screen.getByText("Phone is required");
      expect(errorRequiredPhone).toBeInTheDocument();
      const errorRequiredProject = screen.getByText("Project is required");
      expect(errorRequiredProject).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
  it("shows correct validaiton error messages when phone and email have wrong format", async () => {
    const initialValues: CustomerFormValues = {
      address: "a",
      company: "b",
      email: "c",
      name: "d",
      phone: "e",
    };

    const mockOnSubmit = vi.fn();
    const fieldDisabled = false;
    render(
      <SharedForm<CustomerFormValues>
        initialValues={initialValues}
        validationSchema={customerFormValidationSchema}
        onSubmit={mockOnSubmit}
      >
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-8">Title</h1>
          <div className="flex flex-col md:flex-row md:gap-10">
            <div className="flex flex-col w-fit">
              <CustomInput
                type="text"
                label="Address"
                name="address"
                placeholder="Enter address"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Company"
                name="company"
                placeholder="Enter company"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Email"
                name="email"
                placeholder="Enter email"
                disabled={fieldDisabled}
              />
            </div>
            <div className="flex flex-col w-fit">
              <CustomInput
                type="text"
                label="Name"
                name="name"
                placeholder="Enter name"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Phone"
                name="phone"
                placeholder="Enter phone"
                disabled={fieldDisabled}
              />
              <CustomInput
                type="text"
                label="Project"
                name="project"
                placeholder="Enter project"
                disabled={fieldDisabled}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-fit bg-blue-500 text-white mt-4 py-2 px-4 rounded hover:bg-blue-600 uppercase font-bold disabled:bg-gray-500"
            disabled={fieldDisabled}
          >
            Button text
          </button>
        </div>
      </SharedForm>
    );
    const button = screen.getByText("Button text");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      const errorWrongPhone = screen.getByText("Phone must contain 9 digits");
      expect(errorWrongPhone).toBeInTheDocument();

      const errorWrongEmail = screen.getByText("Invalid email");
      expect(errorWrongEmail).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
