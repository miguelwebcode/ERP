// vi.mock("react", () => ({
//     useRef: vi.fn()
// }))
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import SharedForm from "./SharedForm";
import { CustomerFormValues } from "../../types/form-values-types";
import { customerFormValidationSchema } from "../../schemas";
import { CustomInput } from "./CustomInput/CustomInput";

const initialValuesCustomerForm: CustomerFormValues = {
  address: "address",
  company: "company",
  email: "email@em.com",
  name: "name",
  phone: "123456789",
  project: "project",
};

const mockOnSubmit = vi.fn();
describe("SharedForm", () => {
  describe("SharedForm wrapping CustomerFormValues", () => {
    beforeEach(() => {
      const fieldDisabled = false;
      render(
        <SharedForm<CustomerFormValues>
          initialValues={initialValuesCustomerForm}
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
      expect(inputAddress.value).toBe(initialValuesCustomerForm.address);

      const inputCompany = screen.getByLabelText("Company") as HTMLInputElement;
      expect(inputCompany.value).toBe(initialValuesCustomerForm.company);

      const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
      expect(inputEmail.value).toBe(initialValuesCustomerForm.email);

      const inputName = screen.getByLabelText("Name") as HTMLInputElement;
      expect(inputName.value).toBe(initialValuesCustomerForm.name);

      const inputPhone = screen.getByLabelText("Phone") as HTMLInputElement;
      expect(inputPhone.value).toBe(initialValuesCustomerForm.phone);

      const inputProject = screen.getByLabelText("Project") as HTMLInputElement;
      expect(inputProject.value).toBe(initialValuesCustomerForm.project);

      const button = screen.getByText("Button text");
      expect(button).toBeInTheDocument();
    });

    it("calls onSubmit", async () => {
      const button = screen.getByText("Button text");
      expect(button).toBeInTheDocument();

      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });
});
