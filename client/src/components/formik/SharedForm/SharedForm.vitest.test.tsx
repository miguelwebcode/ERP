import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SharedForm from "./SharedForm";
import {
  CustomerFormValues,
  LoginFormValues,
  ProjectFormValues,
  RegisterFormValues,
  SelectCustomerFormValues,
  SelectProjectFormValues,
} from "../../../types/form-values-types";
import {
  customerFormValidationSchema,
  loginFormValidationSchema,
  projectFormValidationSchema,
  registerFormValidationSchema,
  selectCustomerFormValidationSchema,
  selectProjectFormValidationSchema,
} from "../../../schemas";
import { CustomInput } from "../CustomInput/CustomInput";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import LoginForm from "../../login/LoginForm/LoginForm";

describe("SharedForm", () => {
  describe("SharedForm wrapping CustomerFormValue, Happy paths", () => {
    const initialValues: CustomerFormValues = {
      address: "address",
      company: "company",
      email: "email@em.com",
      name: "name",
      phone: "123456789",
      project: "project",
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
                  placeholder="Enter customer's address"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Company"
                  name="company"
                  placeholder="Enter customer's company"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Email"
                  name="email"
                  placeholder="Enter customer's email"
                  disabled={fieldDisabled}
                />
              </div>
              <div className="flex flex-col w-fit">
                <CustomInput
                  type="text"
                  label="Name"
                  name="name"
                  placeholder="Enter customer's name"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Phone"
                  name="phone"
                  placeholder="Enter customer's phone"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Project"
                  name="project"
                  placeholder="Enter customer's project"
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

      const inputProject = screen.getByLabelText("Project") as HTMLInputElement;
      expect(inputProject.value).toBe(initialValues.project);

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
        project: "",
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
                  placeholder="Enter customer's address"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Company"
                  name="company"
                  placeholder="Enter customer's company"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Email"
                  name="email"
                  placeholder="Enter customer's email"
                  disabled={fieldDisabled}
                />
              </div>
              <div className="flex flex-col w-fit">
                <CustomInput
                  type="text"
                  label="Name"
                  name="name"
                  placeholder="Enter customer's name"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Phone"
                  name="phone"
                  placeholder="Enter customer's phone"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Project"
                  name="project"
                  placeholder="Enter customer's project"
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
      });
    });
    it("shows correct validaiton error messages when phone and email have wrong format", async () => {
      const initialValues: CustomerFormValues = {
        address: "a",
        company: "b",
        email: "c",
        name: "d",
        phone: "e",
        project: "f",
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
                  placeholder="Enter customer's address"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Company"
                  name="company"
                  placeholder="Enter customer's company"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Email"
                  name="email"
                  placeholder="Enter customer's email"
                  disabled={fieldDisabled}
                />
              </div>
              <div className="flex flex-col w-fit">
                <CustomInput
                  type="text"
                  label="Name"
                  name="name"
                  placeholder="Enter customer's name"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Phone"
                  name="phone"
                  placeholder="Enter customer's phone"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Project"
                  name="project"
                  placeholder="Enter customer's project"
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
      });
    });
  });
  describe("SharedForm wrapping CustomerFormValues, wrong phone number", () => {
    const initialValues: CustomerFormValues = {
      address: "address",
      company: "company",
      email: "email@em.com",
      name: "name",
      phone: "123456789",
      project: "project",
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
                  placeholder="Enter customer's address"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Company"
                  name="company"
                  placeholder="Enter customer's company"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Email"
                  name="email"
                  placeholder="Enter customer's email"
                  disabled={fieldDisabled}
                />
              </div>
              <div className="flex flex-col w-fit">
                <CustomInput
                  type="text"
                  label="Name"
                  name="name"
                  placeholder="Enter customer's name"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Phone"
                  name="phone"
                  placeholder="Enter customer's phone"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Project"
                  name="project"
                  placeholder="Enter customer's project"
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

      const inputProject = screen.getByLabelText("Project") as HTMLInputElement;
      expect(inputProject.value).toBe(initialValues.project);

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
  describe("SharedForm wrapping SelectCustomerFormValues", () => {
    const initialValues: SelectCustomerFormValues = {
      customerId: "1",
    };
    const mockOnSubmit = vi.fn();
    const customerIds = ["1", "2", "3"];
    beforeEach(() => {
      render(
        <SharedForm<SelectCustomerFormValues>
          initialValues={initialValues}
          validationSchema={selectCustomerFormValidationSchema}
          onSubmit={mockOnSubmit}
        >
          <CustomSelect label="Customer ID" name="customerId">
            <option value="" className="text-center">
              -- Select customer ID --
            </option>
            {customerIds.map((id, index) => (
              <option key={index} value={id}>
                {id}
              </option>
            ))}
          </CustomSelect>
          <button
            type="submit"
            className="w-4/5 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </SharedForm>
      );
    });
    it("shows correct initialValues", () => {
      const selectCustomerId = screen.getByLabelText(
        "Customer ID"
      ) as HTMLSelectElement;
      expect(selectCustomerId).toBeInTheDocument();
      expect(selectCustomerId.value).toBe("1");
    });
    it("calls onSubmit when: option selected and button is clicked", async () => {
      const selectCustomerId = screen.getByLabelText(
        "Customer ID"
      ) as HTMLSelectElement;
      expect(selectCustomerId).toBeInTheDocument();
      expect(selectCustomerId.value).toBe("1");

      const button = screen.getByRole("button", { name: /subm/i });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });
  describe("SharedForm wrapping ProjectFormValues", () => {
    const initialValues: ProjectFormValues = {
      name: "name",
      description: "description",
      customerId: "customerId",
      developer: "dev1",
      state: "pending",
      startDate: "2025-01-31",
      endDate: "2026-01-31",
    };
    const mockOnSubmit = vi.fn();
    const fieldDisabled = false;
    const projectStates = [
      { id: "pending", value: "Pending" },
      { id: "progress", value: "Progress" },
      { id: "done", value: "Done" },
    ];
    beforeEach(() => {
      render(
        <SharedForm<ProjectFormValues>
          initialValues={initialValues}
          validationSchema={projectFormValidationSchema}
          onSubmit={mockOnSubmit}
        >
          <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-8">Title</h1>
            <div className="flex flex-col md:flex-row md:gap-10">
              <div className="flex flex-col w-64">
                <CustomInput
                  type="text"
                  label="Name"
                  name="name"
                  placeholder="Enter project's name"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Description"
                  name="description"
                  placeholder="Enter project's description"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Customer ID"
                  name="customerId"
                  placeholder="Enter project's customer id"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="text"
                  label="Assigned Developer"
                  name="developer"
                  placeholder="Enter project's developer"
                  disabled={fieldDisabled}
                />
              </div>
              <div className="flex flex-col w-fit">
                <CustomSelect
                  label="Project State"
                  name="state"
                  disabled={fieldDisabled}
                >
                  <option className="text-center" value="">
                    -- Select an option --
                  </option>
                  {projectStates.map((projectState) => {
                    return (
                      <option key={projectState.id} value={projectState.id}>
                        {projectState.value}
                      </option>
                    );
                  })}
                </CustomSelect>
                <CustomInput
                  type="date"
                  label="Start Date"
                  name="startDate"
                  placeholder="Enter project's startDate"
                  disabled={fieldDisabled}
                />
                <CustomInput
                  type="date"
                  label="End Date"
                  name="endDate"
                  placeholder="Enter project's endDate"
                  disabled={fieldDisabled}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-fit bg-blue-500 text-white mt-4 py-2 px-4 rounded hover:bg-blue-600 uppercase font-bold disabled:bg-gray-500"
              disabled={fieldDisabled}
            >
              Submit
            </button>
          </div>
        </SharedForm>
      );
    });
    it("shows correct initialValues", () => {
      const title = screen.getByText("Title");
      expect(title).toBeInTheDocument();

      const inputName = screen.getByLabelText("Name") as HTMLInputElement;
      expect(inputName.type).toBe("text");
      expect(inputName.value).toBe(initialValues.name);

      const inputDescription = screen.getByLabelText(
        "Description"
      ) as HTMLInputElement;
      expect(inputDescription.type).toBe("text");
      expect(inputDescription.value).toBe(initialValues.description);

      const inputCustomerId = screen.getByLabelText(
        "Customer ID"
      ) as HTMLInputElement;
      expect(inputCustomerId.type).toBe("text");
      expect(inputCustomerId.value).toBe(initialValues.customerId);

      const inputDeveloper = screen.getByLabelText(
        "Assigned Developer"
      ) as HTMLInputElement;
      expect(inputDeveloper.type).toBe("text");
      expect(inputDeveloper.value).toBe(initialValues.developer);

      const inputState = screen.getByLabelText(
        "Project State"
      ) as HTMLSelectElement;
      expect(inputState.type).toBe("select-one");
      expect(inputState.value).toBe(initialValues.state);

      const inpuStartDate = screen.getByLabelText(
        "Start Date"
      ) as HTMLInputElement;
      expect(inpuStartDate.type).toBe("date");
      expect(inpuStartDate.value).toBe(initialValues.startDate);

      const inpuEndDate = screen.getByLabelText("End Date") as HTMLInputElement;
      expect(inpuEndDate.type).toBe("date");
      expect(inpuEndDate.value).toBe(initialValues.endDate);
    });
    it("calls onSubmit when form filled out and button is clicked", async () => {
      const button = screen.getByRole("button", { name: /submit/i });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });
  describe("SharedForm wrapping SelectProjectFormValues", () => {
    const initialValues: SelectProjectFormValues = {
      projectId: "1",
    };
    const mockOnSubmit = vi.fn();
    const projectIds = ["1", "2", "3"];
    beforeEach(() => {
      render(
        <SharedForm<SelectProjectFormValues>
          initialValues={initialValues}
          validationSchema={selectProjectFormValidationSchema}
          onSubmit={mockOnSubmit}
        >
          <CustomSelect label="Project ID" name="projectId">
            <option value="" className="text-center">
              -- Select project ID --
            </option>
            {projectIds.map((id, index) => (
              <option key={index} value={id}>
                {id}
              </option>
            ))}{" "}
            <button
              type="submit"
              className="w-4/5 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
            >
              "Submit"
            </button>
          </CustomSelect>
        </SharedForm>
      );
    });
    it("shows correct initialValues", () => {
      const selectProjectId = screen.getByLabelText(
        "Project ID"
      ) as HTMLSelectElement;
      expect(selectProjectId).toBeInTheDocument();
      expect(selectProjectId.type).toBe("select-one");
      expect(selectProjectId.value).toBe(initialValues.projectId);
    });
    it("calls onSubmit when form filled out and button clicked", async () => {
      const button = screen.getByRole("button", { name: /submit/i });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });
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
            placeholder="Enter your email"
          />
          <CustomInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
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

      const inputPassword = screen.getByLabelText(
        "Password"
      ) as HTMLInputElement;
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

      const inputPassword = screen.getByLabelText(
        "Password"
      ) as HTMLInputElement;
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
});
