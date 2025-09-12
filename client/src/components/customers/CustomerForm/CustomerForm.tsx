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
      <div className="flex flex-col items-center justify-center bg-ds-white p-8 rounded shadow-ds-2">
        <h1 className="text-2xl font-bold mb-8">{titleText}</h1>
        <div className="grid grid-cols-2 gap-y-5 gap-x-5">
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              type="text"
              label="Name"
              name="name"
              placeholder="Enter name"
              disabled={fieldDisabled}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              type="text"
              label="Company"
              name="company"
              placeholder="Enter company"
              disabled={fieldDisabled}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              type="text"
              label="Address"
              name="address"
              placeholder="Enter address"
              disabled={fieldDisabled}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              type="text"
              label="Phone"
              name="phone"
              placeholder="Enter phone"
              disabled={fieldDisabled}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
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
          className="w-full bg-ds-primary-500 text-ds-white mt-8 py-3 px-4 rounded hover:bg-ds-primary-600 uppercase font-bold disabled:bg-ds-grey-400"
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
