import SharedForm from "../../formik/SharedForm/SharedForm";
import { employeeFormValidationSchema } from "../../../schemas";
import { CustomInput } from "../../formik/CustomInput/CustomInput";
import { FormikHelpers, FormikProps } from "formik";
import { EmployeeFormValues } from "../../../types/form-values-types";
import { useRef, useEffect, useMemo } from "react";
import { setEmployeeFormValues } from "../../../services/employees/service/employeesService";
import { useAppStore } from "../../../stores/app-store";

type EmployeeFormProps = {
  titleText: string;
  submitButtonText: string;
  onSubmit: (
    values: EmployeeFormValues,
    formikHelpers: FormikHelpers<EmployeeFormValues>
  ) => void;
  canBeDisabled?: boolean;
};

const EmployeeForm = ({
  titleText,
  submitButtonText,
  onSubmit: handleSubmit,
  canBeDisabled,
}: EmployeeFormProps) => {
  const formikRef = useRef<FormikProps<EmployeeFormValues>>(null);
  const initialValues: EmployeeFormValues = {
    name: "",
    role: "",
    email: "",
    phone: "",
    address: "",
    salary: "",
  };

  const selectedEmployeeId = useAppStore((state) => state.selectedEmployeeId);

  useEffect(() => {
    /* 
     On first useEffect, form is not mounted yet, its reference formikRef.current
     is null. Then, on selectedEmployeeId change, useEffect is executed again...
     this second time form is rendered, so it executes the function inside if statement 
    */
    if (formikRef.current) {
      setEmployeeFormValues(formikRef.current, selectedEmployeeId);
    }
  }, [selectedEmployeeId]);

  const fieldDisabled = useMemo(
    () => canBeDisabled && selectedEmployeeId === "",
    [selectedEmployeeId]
  );

  return (
    <SharedForm<EmployeeFormValues>
      initialValues={initialValues}
      validationSchema={employeeFormValidationSchema}
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
            label="Role"
            name="role"
            placeholder="Enter role"
            disabled={fieldDisabled}
          />
          <CustomInput
            type="text"
            label="Email"
            name="email"
            placeholder="Enter email"
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
            label="Address"
            name="address"
            placeholder="Enter address"
            disabled={fieldDisabled}
          />
          <CustomInput
            type="text"
            label="Salary"
            name="salary"
            placeholder="Enter salary"
            disabled={fieldDisabled}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-ds-primary-500 text-ds-white mt-ds-32 py-ds-12 px-ds-16 rounded-ds-sm hover:bg-ds-primary-600 uppercase font-bold disabled:bg-ds-grey-400"
          disabled={fieldDisabled}
        >
          <p className="text-ds-lg">{submitButtonText}</p>
        </button>
      </div>
    </SharedForm>
  );
};

export default EmployeeForm;
