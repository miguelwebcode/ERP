import { useState, useEffect } from "react";
import { FormikHelpers } from "formik";
import { selectEmployeeFormValidationSchema } from "../../../schemas";
import { CustomSelect } from "../../formik/CustomSelect/CustomSelect";
import SharedForm from "../../formik/SharedForm/SharedForm";
import { fetchEmployeeIds } from "../../../services/employees/service/employeesService";
import { SelectEmployeeFormValues } from "../../../types/form-values-types";
import { useAppStore } from "../../../stores/app-store";

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
  const [employeeIds, setEmployeeIds] = useState<string[]>([]);

  const selectedEmployeeId = useAppStore((state) => state.selectedEmployeeId);

  const initialValues: SelectEmployeeFormValues = {
    employeeId: "",
  };

  useEffect(() => {
    fetchEmployeeIds(setEmployeeIds);
  }, [selectedEmployeeId]);

  return (
    <SharedForm<SelectEmployeeFormValues>
      initialValues={initialValues}
      validationSchema={selectEmployeeFormValidationSchema}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col items-center justify-center bg-ds-white p-ds-20 rounded shadow-ds-2 h-fit w-ds-384">
          <h1 className="text-2xl font-bold mb-ds-16">Select Employee</h1>
          <CustomSelect label="Employee ID" name="employeeId">
            <option value="" className="text-center">
              -- Select employee ID --
            </option>
            {employeeIds.map((id, index) => (
              <option key={index} value={id}>
                {id}
              </option>
            ))}
          </CustomSelect>
          <button type="submit" className="form-button mt-ds-20">
            <p className="text-xl">{buttonText}</p>
          </button>
        </div>
      </div>
    </SharedForm>
  );
};

export default SelectEmployeeForm;
