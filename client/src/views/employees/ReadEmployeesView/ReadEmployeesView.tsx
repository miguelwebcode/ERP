import { useEffect, useState } from "react";
import { fetchAllEmployees } from "../../../services/employees/service/employeesService";
import { Employee } from "../../../types";
import { EmployeeCard } from "../../../components/employees/EmployeeCard/EmployeeCard";
import { SharedCard } from "../../../components/ui/SharedCard/SharedCard";
import { NoEmployeesFoundMessage } from "../../../components/employees/NoEmployeesFoundMessage/NoEmployeesFoundMessage";

export const ReadEmployeesView = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => {
    fetchAllEmployees(setEmployees);
  }, []);
  return (
    <>
      {employees.length ? (
        <div className="flex justify-center flex-wrap gap-6 h-[80vh] overflow-y-auto">
          {employees.map((employee, i) => {
            return (
              <SharedCard key={i}>
                <EmployeeCard employee={employee} />
              </SharedCard>
            );
          })}
        </div>
      ) : (
        <NoEmployeesFoundMessage />
      )}
    </>
  );
};
