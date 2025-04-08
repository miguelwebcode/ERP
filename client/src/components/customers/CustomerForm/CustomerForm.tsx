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
    [selectedCustomerId]
  );

  return (
    <SharedForm<CustomerFormValues>
      initialValues={initialValues}
      validationSchema={customerFormValidationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      <div className="flex flex-col items-center justify-center bg-ds-white p-ds-32 rounded-ds-sm shadow-ds-2">
        <h1 className="text-ds-xl font-bold mb-ds-32">{titleText}</h1>
        <div className="grid grid-cols-2 gap-y-ds-20 gap-x-ds-20">
          <CustomInput
            type="text"
            label="Name"
            name="name"
            placeholder="Enter name"
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
            label="Address"
            name="address"
            placeholder="Enter address"
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
            label="Email"
            name="email"
            placeholder="Enter email"
            disabled={fieldDisabled}
          />
        </div>
        <button
          type="submit"
          className="w-ds-192 bg-ds-primary-500 text-ds-white mt-ds-32 py-ds-12 px-ds-16 rounded-ds-md hover:bg-ds-primary-600 uppercase font-bold disabled:bg-ds-grey-400"
          disabled={fieldDisabled}
        >
          <p className="text-ds-lg">{submitButtonText}</p>
        </button>
      </div>
    </SharedForm>
  );
};

export default CustomerForm;
