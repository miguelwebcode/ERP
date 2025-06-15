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
  const [isLoading, setIsLoading] = useState(true);

  const selectedEmployeeId = useAppStore((state) => state.selectedEmployeeId);

  const setSelectedEmployeeId = useAppStore(
    (state) => state.setSelectedEmployeeId
  );

  useEffect(() => {
    fetchAllEmployees((fetchedEmployees) => {
      setEmployees(fetchedEmployees);
      setIsLoading(false);
    });

    selectedEmployeeId && setSelectedEmployeeId(selectedEmployeeId);

    return () => {
      setSelectedEmployeeId("");
    };
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

  if (isLoading) {
    return null;
  }

  return (
    <>
      {employees.length ? (
        <div className="flex flex-col gap-8 justify-center px-5">
          <SelectEmployeeForm buttonText="GET DATA" onSubmit={handleSubmit} />
          <EmployeeForm
            titleText="EDIT EMPLOYEE"
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
