import { useState, useEffect } from "react";
import { FormikHelpers } from "formik";
import { selectEmployeeFormValidationSchema } from "../../../schemas";
import { CustomSelect } from "../../formik/CustomSelect/CustomSelect";
import SharedForm from "../../formik/SharedForm/SharedForm";
import { fetchAllEmployees } from "../../../services/employees/service/employeesService";
import { SelectEmployeeFormValues } from "../../../types/form-values-types";
import { useAppStore } from "../../../stores/app-store";
import { Employee } from "@/types";

type SelectEmployeeForm = {
  buttonText: string;
  onSubmit: (
    values: SelectEmployeeFormValues,
    formikHelpers: FormikHelpers<SelectEmployeeFormValues>
  ) => Promise<void>;
};

const SelectEmployeeForm = ({
  buttonText,
  onSubmit: handleSubmit,
}: SelectEmployeeForm) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const selectedEmployeeId = useAppStore((state) => state.selectedEmployeeId);

  const initialValues: SelectEmployeeFormValues = {
    employeeId: "",
  };

  useEffect(() => {
    fetchAllEmployees(setEmployees);
  }, [selectedEmployeeId]);

  return (
    <SharedForm<SelectEmployeeFormValues>
      initialValues={initialValues}
      validationSchema={selectEmployeeFormValidationSchema}
      onSubmit={handleSubmit}
    >
      <div className="w-full max-w-md px-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Select Employee</h1>
        <CustomSelect label="Employee ID" name="employeeId">
          <option value="" className="text-center">
            -- Select employee ID --
          </option>
          {employees.map((employee, index) => (
            <option key={index} value={employee.id}>
              {`${employee.name}: ${employee.id}`}
            </option>
          ))}
        </CustomSelect>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white mt-6 py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
        >
          <p className="text-xl">{buttonText}</p>
        </button>
      </div>
    </SharedForm>
  );
};

export default SelectEmployeeForm;
