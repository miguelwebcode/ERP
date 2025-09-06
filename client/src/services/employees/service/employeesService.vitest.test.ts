import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { FormikProps } from "formik";
import { Employee } from "../../../types";
import { EmployeeFormValues } from "../../../types/form-values-types";
import {
  getAllEmployeeIds,
  getEmployeeById,
  getAllEmployees,
  deleteEmployeeById,
} from "../repository/employeesRepository";
import {
  countEmployeesByRole,
  fetchAllEmployees,
  fetchEmployee,
  fetchEmployeeIds,
  handleDeleteEmployee,
  setEmployeeFormValues,
} from "./employeesService";

vi.mock("../repository/employeesRepository", () => ({
  getAllEmployeeIds: vi.fn(),
  getEmployeeById: vi.fn(),
  getAllEmployees: vi.fn(),
  deleteEmployeeById: vi.fn(),
}));

describe("fetchEmployeeIds", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let callback: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    callback = vi.fn((_ids: string[]) => void 0);
  });

  it("should get ids and pass ids as arg", async () => {
    const ids = ["1", "2", "3"];
    (getAllEmployeeIds as Mock).mockReturnValue(ids);
    const result = await fetchEmployeeIds(callback);
    expect(getAllEmployeeIds).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(ids);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
  it("should manage errors correctly", async () => {
    const error = new Error("error message");
    (getAllEmployeeIds as Mock).mockRejectedValue(error);
    const result = await fetchEmployeeIds(callback);
    expect(getAllEmployeeIds).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching employee IDs: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("setEmployeeFormValues", () => {
  const formik = {
    setValues: vi.fn((_newValues: EmployeeFormValues) => void 0),
  } as unknown as FormikProps<EmployeeFormValues>;
  const selectedEmployeeId = "1";

  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should set form values", async () => {
    const selectedEmployee: Employee = {
      id: "1",
      name: "Juan",
      role: "developer",
      email: "juan@email.com",
      phone: "111111111",
      address: "street 90",
      salary: "1000",
    };
    (getEmployeeById as Mock).mockReturnValue(selectedEmployee);

    const { id, ...formValues } = selectedEmployee;
    const newValues: EmployeeFormValues = formValues;

    const result = await setEmployeeFormValues(formik, selectedEmployeeId);
    expect(formik.setValues).toHaveBeenCalledWith(newValues);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("test error");
    (getEmployeeById as Mock).mockRejectedValue(error);
    const result = await setEmployeeFormValues(formik, selectedEmployeeId);
    expect(getEmployeeById).toHaveBeenCalledWith(selectedEmployeeId);
    expect(formik.setValues).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error setting employee form values: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("fetchEmployee", () => {
  const selectedEmployeeId = "1";
  let callback: ReturnType<typeof vi.fn>;

  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    callback = vi.fn((_value: React.SetStateAction<Employee>) => void 0);
  });

  it("should fetch employee data", async () => {
    const employee: Employee = {
      id: "1",
      name: "Juan",
      role: "developer",
      email: "juan@email.com",
      phone: "111111111",
      address: "street 90",
      salary: "1000",
    };
    (getEmployeeById as Mock).mockReturnValue(employee);
    const result = await fetchEmployee(selectedEmployeeId, callback);
    expect(getEmployeeById).toHaveBeenCalledWith(selectedEmployeeId);
    expect(callback).toHaveBeenCalledWith(employee);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("error msg");
    (getEmployeeById as Mock).mockRejectedValue(error);
    const result = await fetchEmployee(selectedEmployeeId, callback);
    expect(getEmployeeById).toHaveBeenCalledWith(selectedEmployeeId);
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching employee: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("fetchAllEmployees", () => {
  let callback: ReturnType<typeof vi.fn>;

  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    callback = vi.fn((_value: React.SetStateAction<Employee[]>) => void 0);
  });

  it("should fetch all employees", async () => {
    const employees: Employee[] = [
      {
        id: "1",
        name: "Juan",
        role: "developer",
        email: "juan@email.com",
        phone: "111111111",
        address: "street 90",
        salary: "1000",
      },
      {
        id: "2",
        name: "Paco",
        role: "developer",
        email: "paco@email.com",
        phone: "111111111",
        address: "street 90",
        salary: "1000",
      },
    ];
    (getAllEmployees as Mock).mockReturnValue(employees);
    const result = await fetchAllEmployees(callback);
    expect(getAllEmployees).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(employees);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("Test msg");
    (getAllEmployees as Mock).mockRejectedValue(error);
    const result = await fetchAllEmployees(callback);
    expect(getAllEmployees).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching employees: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("handleDeleteEmployee", () => {
  const selectedEmployeeId = "1";
  let setSelectedEmployeeId: ReturnType<typeof vi.fn>;

  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    setSelectedEmployeeId = vi.fn((_selectedEmployeeId) => void 0);
  });

  it("should deleteEmployeeById and setSelectedEmployeeId to empty string", async () => {
    const result = await handleDeleteEmployee(
      selectedEmployeeId,
      setSelectedEmployeeId
    );
    expect(deleteEmployeeById).toHaveBeenCalledWith(selectedEmployeeId);
    expect(setSelectedEmployeeId).toHaveBeenCalledWith("");
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("error msg");
    (deleteEmployeeById as Mock).mockRejectedValue(error);
    const result = await handleDeleteEmployee(
      selectedEmployeeId,
      setSelectedEmployeeId
    );
    expect(deleteEmployeeById).toHaveBeenCalledWith(selectedEmployeeId);
    expect(setSelectedEmployeeId).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error deleting employee: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("countEmployeesByRole", () => {
  let callback: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    callback = vi.fn((_rolecounts: Record<string, number>) => void 0);
  });

  it("should get all employees, calculate role counts and pass role counts to callback as arg", async () => {
    const employees: Employee[] = [
      {
        id: "1",
        name: "Juan",
        role: "developer",
        email: "juan@email.com",
        phone: "111111111",
        address: "street 90",
        salary: "1000",
      },
      {
        id: "2",
        name: "Paco",
        role: "developer",
        email: "paco@email.com",
        phone: "111111111",
        address: "street 90",
        salary: "1000",
      },
      {
        id: "",
        name: "Bosco",
        role: "salesman",
        email: "bosco@email.com",
        phone: "111111111",
        address: "street 90",
        salary: "1000",
      },
    ];
    (getAllEmployees as Mock).mockReturnValue(employees);
    const roleCounts: Record<string, number> = {
      developer: 2,
      salesman: 1,
    };
    const result = await countEmployeesByRole(callback);
    expect(getAllEmployees).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(roleCounts);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("test error");
    (getAllEmployees as Mock).mockRejectedValue(error);
    const result = await countEmployeesByRole(callback);
    expect(getAllEmployees).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error counting employees by role: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
