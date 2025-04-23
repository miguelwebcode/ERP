import { useEffect, useRef, useState } from "react";
import SelectEmployeeForm from "../../../components/employees/SelectEmployeeForm/SelectEmployeeForm";
import { useAppStore } from "../../../stores/app-store";
import { Employee } from "../../../types";
import { EmployeeCard } from "../../../components/employees/EmployeeCard/EmployeeCard";
import { SharedCard } from "../../../components/ui/SharedCard/SharedCard";
import { SelectEmployeeFormValues } from "../../../types/form-values-types";
import { FormikHelpers } from "formik";
import {
  fetchAllEmployees,
  fetchEmployee,
  handleDeleteEmployee,
} from "../../../services/employees/service/employeesService";
import { NoEmployeesFoundMessage } from "../../../components/employees/NoEmployeesFoundMessage/NoEmployeesFoundMessage";

export const DeleteEmployeeView = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedEmployeeId = useAppStore((state) => state.selectedEmployeeId);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(
    {} as Employee
  );

  const setSelectedEmployeeId = useAppStore(
    (state) => state.setSelectedEmployeeId
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    selectedEmployeeId && setSelectedEmployeeId(selectedEmployeeId);

    if (isFirstRender.current) {
      fetchAllEmployees((fetchedEmployees) => {
        setEmployees(fetchedEmployees);
        setIsLoading(false);
      });
      isFirstRender.current = false;
    }
    if (selectedEmployeeId) {
      fetchEmployee(selectedEmployeeId, setSelectedEmployee);
    }

    return () => {
      setSelectedEmployeeId("");
    };
  }, [selectedEmployeeId]);

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
          <SelectEmployeeForm
            buttonText="FETCH CUSTOMER"
            onSubmit={handleSubmit}
          />
          {selectedEmployeeId && (
            <SharedCard>
              <EmployeeCard employee={selectedEmployee} />
              <div className="flex justify-center mb-6 mx-5">
                <button
                  className="form-button"
                  onClick={async () => {
                    await handleDeleteEmployee(
                      selectedEmployeeId,
                      setSelectedEmployeeId
                    );
                  }}
                >
                  <p className="text-xl">DELETE</p>
                </button>
              </div>
            </SharedCard>
          )}
        </div>
      ) : (
        <NoEmployeesFoundMessage />
      )}
    </>
  );
};
