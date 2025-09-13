import { useEffect, useState } from "react";
import { fetchAllEmployees } from "../../../services/employees/service/employeesService";
import { Employee } from "../../../types";
import { NoEmployeesFoundMessage } from "../../../components/employees/NoEmployeesFoundMessage/NoEmployeesFoundMessage";
import { MoreHorizontal, Edit, Trash, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/stores/app-store";
import { useNavigate } from "react-router-dom";

const EmployeeActions = ({ employee }: { employee: Employee }) => {
  const setSelectedEmployeeId = useAppStore(
    (state) => state.setSelectedEmployeeId
  );
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(employee.id)}
        >
          <Copy className="mr-2 h-4 w-4" /> Copy employee ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedEmployeeId(employee.id);
            navigate("/employees/edit");
          }}
        >
          <Edit className="mr-2 h-4 w-4" /> Edit employee
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelectedEmployeeId(employee.id);
            navigate("/employees/delete");
          }}
        >
          <Trash className="mr-2 h-4 w-4" /> Delete employee
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ReadEmployeesView = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 8;

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
          <div className="rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                  <th className="text-left py-3 px-4 font-medium">Full Name</th>
                  <th className="text-left py-3 px-4 font-medium">Position</th>
                  <th className="text-left py-3 px-4 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Salary</th>
                </tr>
              </thead>
              <tbody>
                {employees
                  .slice(
                    (currentPage - 1) * employeesPerPage,
                    currentPage * employeesPerPage
                  )
                  .map((employee, index) => (
                    <tr
                      key={employee.id || index}
                      className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    >
                      <td className="py-3 px-4">
                        <EmployeeActions employee={employee} />
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {employee.name}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {employee.role}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {employee.phone}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {employee.email}
                      </td>
                      <td className="py-3 px-4 text-blue-600 font-medium">
                        {employee.salary} €
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {employees.length > 0 && (
              <div className="border-t border-gray-200 bg-white">
                <div className="flex items-center justify-between py-3 px-4 text-sm text-gray-500">
                  <div>
                    Showing {(currentPage - 1) * employeesPerPage + 1}-
                    {Math.min(currentPage * employeesPerPage, employees.length)}{" "}
                    of {employees.length} employees
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="flex items-center text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Previous
                    </button>
                    <span className="text-gray-600">
                      Page {currentPage} of{" "}
                      {Math.ceil(employees.length / employeesPerPage)}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            Math.ceil(employees.length / employeesPerPage)
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(employees.length / employeesPerPage)
                      }
                      className="flex items-center text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <NoEmployeesFoundMessage />
      )}
    </>
  );
};
