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
              label="Role"
              name="role"
              placeholder="Enter role"
              disabled={fieldDisabled}
            />
          </div>
          <div>
            <CustomInput
              type="text"
              label="Email"
              name="email"
              placeholder="Enter email"
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
              label="Salary"
              name="salary"
              placeholder="Enter salary"
              disabled={fieldDisabled}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white mt-8 py-3 px-6 rounded-lg transition-colors duration-200 font-medium disabled:bg-gray-400"
          disabled={fieldDisabled}
        >
          <p className="text-xl">{submitButtonText}</p>
        </button>
      </div>
    </SharedForm>
  );
};

export default EmployeeForm;
