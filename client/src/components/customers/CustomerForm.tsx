import SharedForm from "../formik/SharedForm";
import { customerFormValidationSchema } from "../../schemas";
import { CustomInput } from "../formik/CustomInput";
import { FormikHelpers, FormikProps } from "formik";
import { CustomerFormValues } from "../../types/form-values-types";
import { useRef, useEffect, useMemo } from "react";
import { getCustomerById } from "../../services/customers/customers";
import { useAppStore } from "../../stores/app-store";

type CustomerFormProps = {
  titleText: string;
  submitButtonText: string;
  onSubmit: (
    values: CustomerFormValues,
    formikHelpers: FormikHelpers<CustomerFormValues>
  ) => void;
  canBeDisabled?: boolean;
};

const CustomerForm = ({
  titleText,
  submitButtonText,
  onSubmit: handleSubmit,
  canBeDisabled,
}: CustomerFormProps) => {
  const formikRef = useRef<FormikProps<CustomerFormValues>>(null);
  const initialValues: CustomerFormValues = {
    address: "",
    company: "",
    email: "",
    name: "",
    phone: "",
    project: "",
  };

  const selectedCustomerId = useAppStore((state) => state.selectedCustomerId);

  const setFormValues = async (formik: FormikProps<CustomerFormValues>) => {
    const selectedCustomer = await getCustomerById(selectedCustomerId);
    if (selectedCustomer) {
      const newValues: CustomerFormValues = {
        address: selectedCustomer["address"],
        company: selectedCustomer["company"],
        email: selectedCustomer["email"],
        name: selectedCustomer["name"],
        phone: selectedCustomer["phone"],
        project: selectedCustomer["project"],
      };
      formik.setValues(newValues);
    }
  };

  useEffect(() => {
    if (formikRef.current) {
      setFormValues(formikRef.current);
    }
  }, [selectedCustomerId]);

  const fieldDisabled = useMemo(
    () => canBeDisabled && selectedCustomerId === "",
    [selectedCustomerId]
  );

  return (
    <SharedForm<CustomerFormValues>
      initialValues={initialValues}
      validationSchema={customerFormValidationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-8">{titleText}</h1>
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
          {submitButtonText}
        </button>
      </div>
    </SharedForm>
  );
};

export default CustomerForm;
