import SharedForm from "../../formik/SharedForm/SharedForm";
import { customerFormValidationSchema } from "../../../schemas";
import { CustomInput } from "../../formik/CustomInput/CustomInput";
import { FormikHelpers, FormikProps } from "formik";
import { CustomerFormValues } from "../../../types/form-values-types";
import { useRef, useEffect, useMemo } from "react";
import { setCustomerFormValues } from "../../../services/customers/service/customersService";
import { useAppStore } from "../../../stores/app-store";

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
  };

  const selectedCustomerId = useAppStore((state) => state.selectedCustomerId);

  useEffect(() => {
    /* 
     On first useEffect, form is not mounted yet, its reference formikRef.current
     is null. Then, on selectedCustomerId change, useEffect is executed again...
     this second time form is rendered, so it executes the function inside if statement 
    */
    if (formikRef.current) {
      setCustomerFormValues(formikRef.current, selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const fieldDisabled = useMemo(
    () => canBeDisabled && selectedCustomerId === "",
    [canBeDisabled, selectedCustomerId]
  );

  return (
    <SharedForm<CustomerFormValues>
      initialValues={initialValues}
      validationSchema={customerFormValidationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      <div className="w-full px-8">
        <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
          {titleText}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <CustomInput
              type="text"
              label="Name"
              name="name"
              placeholder="Enter name"
              disabled={fieldDisabled}
            />
          </div>
          <div>
            <CustomInput
              type="text"
              label="Company"
              name="company"
              placeholder="Enter company"
              disabled={fieldDisabled}
            />
          </div>
          <div>
            <CustomInput
              type="text"
              label="Address"
              name="address"
              placeholder="Enter address"
              disabled={fieldDisabled}
            />
          </div>
          <div>
            <CustomInput
              type="text"
              label="Phone"
              name="phone"
              placeholder="Enter phone"
              disabled={fieldDisabled}
            />
          </div>
          <div className="md:col-span-2">
            <CustomInput
              type="text"
              label="Email"
              name="email"
              placeholder="Enter email"
              disabled={fieldDisabled}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white mt-8 py-3 px-6 rounded-lg transition-colors duration-200 font-medium disabled:bg-gray-400"
          disabled={fieldDisabled}
          data-testid="submit-button"
        >
          <p className="text-xl">{submitButtonText}</p>
        </button>
      </div>
    </SharedForm>
  );
};

export default CustomerForm;
