import { FormikProps } from "formik";
import { Employee } from "../../../types";
import { EmployeeFormValues } from "../../../types/form-values-types";
import {
  getAllEmployeeIds,
  getEmployeeById,
  getAllEmployees,
  deleteEmployeeById,
} from "../repository/employeesRepository";

export const fetchEmployeeIds = async (callback: (ids: string[]) => void) => {
  try {
    const ids: string[] = (await getAllEmployeeIds()) || [];
    callback(ids);
  } catch (error) {
    console.error("Error fetching employee IDs: ", error);
  }
};

export const setEmployeeFormValues = async (
  formik: FormikProps<EmployeeFormValues>,
  selectedEmployeeId: string
) => {
  try {
    const selectedEmployee = (await getEmployeeById(
      selectedEmployeeId
    )) as Employee;
    if (selectedEmployee) {
      const newValues: EmployeeFormValues = {
        name: selectedEmployee.name,
        role: selectedEmployee.role,
        email: selectedEmployee.email,
        phone: selectedEmployee.phone,
        address: selectedEmployee.address,
        salary: selectedEmployee.salary,
      };
      formik.setValues(newValues);
    }
  } catch (error) {
    console.error("Error setting employee form values: ", error);
  }
};

export const fetchEmployee = async (
  selectedEmployeeId: string,
  callback: (value: React.SetStateAction<Employee>) => void
) => {
  try {
    const result = await getEmployeeById(selectedEmployeeId);
    callback(result as Employee);
  } catch (error) {
    console.error("Error fetching employee: ", error);
  }
};

export const fetchAllEmployees = async (
  callback: (value: React.SetStateAction<Employee[]>) => void
) => {
  try {
    const result = await getAllEmployees();
    callback(result as Employee[]);
  } catch (error) {
    console.error("Error fetching employees: ", error);
  }
};

export const handleDeleteEmployee = async (
  selectedEmployeeId: string,
  setSelectedEmployeeId: (selectedEmployeeId: string) => void
) => {
  try {
    await deleteEmployeeById(selectedEmployeeId);
    setSelectedEmployeeId("");
  } catch (error) {
    console.error("Error deleting employee: ", error);
  }
};

export const countEmployeesByRole = async (
  callback: (roleCounts: Record<string, number>) => void
) => {
  try {
    const employees = await getAllEmployees();
    const typedEmployees = employees!.map((doc) => doc as Employee); // Asegura que los datos sean del tipo Employee
    const roleCounts = typedEmployees.reduce(
      (acc: Record<string, number>, employee: Employee) => {
        acc[employee.role] = (acc[employee.role] || 0) + 1;
        return acc;
      },
      {}
    );
    callback(roleCounts);
  } catch (error) {
    console.error("Error counting employees by role: ", error);
  }
};
