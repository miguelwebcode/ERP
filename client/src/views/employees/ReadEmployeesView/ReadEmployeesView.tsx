import { useEffect, useState } from "react";
import { fetchAllEmployees } from "../../../services/employees/service/employeesService";
import { Employee } from "../../../types";
import { NoEmployeesFoundMessage } from "../../../components/employees/NoEmployeesFoundMessage/NoEmployeesFoundMessage";
import { employeeColumns } from "@/components/employees/employeeColumns/employeeColumns";
import { DataTable } from "@/components/ui/data-table";

export const ReadEmployeesView = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllEmployees((fetchedEmployees) => {
      setEmployees(fetchedEmployees);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <>
      {employees.length ? (
        <div className="container mx-auto md:mx-10 py-10">
          <DataTable columns={employeeColumns} data={employees} />
        </div>
      ) : (
        <NoEmployeesFoundMessage />
      )}
    </>
  );
};
