import { FormikHelpers } from "formik";
import EmployeeForm from "../../../components/employees/EmployeeForm/EmployeeForm";
import { handleEditEmployee } from "../../../services/employees/repository/employeesRepository";
import { useAppStore } from "../../../stores/app-store";
import {
  EmployeeFormValues,
  SelectEmployeeFormValues,
} from "../../../types/form-values-types";
import { useState, useEffect } from "react";
import SelectEmployeeForm from "../../../components/employees/SelectEmployeeForm/SelectEmployeeForm";
import { Employee } from "../../../types";
import { NoEmployeesFoundMessage } from "../../../components/employees/NoEmployeesFoundMessage/NoEmployeesFoundMessage";
import { fetchAllEmployees } from "../../../services/employees/service/employeesService";

export const EditEmployeeView = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isRenderDone, setIsRenderDone] = useState(false);
  const selectedEmployeeId = useAppStore((state) => state.selectedEmployeeId);

  const setSelectedEmployeeId = useAppStore(
    (state) => state.setSelectedEmployeeId
  );

  useEffect(() => {
    setSelectedEmployeeId("");
    fetchAllEmployees(setEmployees);
    setIsRenderDone(true);
  }, []);

  const handleSubmit = async (
    values: SelectEmployeeFormValues,
    formikHelpers: FormikHelpers<SelectEmployeeFormValues>
  ) => {
    try {
      setSelectedEmployeeId(values.employeeId);
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error getting employee: ", error);
      alert("Error getting employee!");
    }
  };
  return (
    <>
      {employees.length && isRenderDone ? (
        <div className="flex flex-col gap-ds-32 justify-center px-ds-20">
          <SelectEmployeeForm buttonText="GET DATA" onSubmit={handleSubmit} />
          <EmployeeForm
            titleText="EDIT CUSTOMER"
            submitButtonText="UPDATE"
            canBeDisabled={true}
            onSubmit={async (
              values: EmployeeFormValues,
              formikHelpers: FormikHelpers<EmployeeFormValues>
            ) => {
              await handleEditEmployee(
                selectedEmployeeId,
                values,
                formikHelpers
              );
              setSelectedEmployeeId("");
            }}
          />
        </div>
      ) : (
        <NoEmployeesFoundMessage />
      )}
    </>
  );
};

export default EditEmployeeView;
