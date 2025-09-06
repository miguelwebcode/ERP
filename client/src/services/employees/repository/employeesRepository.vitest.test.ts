import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import {
  getAllEmployees,
  getEmployeeById,
  getAllEmployeeIds,
  handleCreateEmployee,
  handleEditEmployee,
  deleteEmployeeById,
} from "./employeesRepository";
import { auth, db } from "../../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  QuerySnapshot,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { formatDate } from "../..";
import { EmployeeFormValues } from "../../../types/form-values-types";
import { FormikHelpers } from "formik";
import { toast } from "react-toastify";

vi.mock("react-toastify", { spy: true });

// Mock auth and db
vi.mock("../../firebaseConfig", () => ({
  auth: { currentUser: null },
  db: {},
}));

// Mock firestore functions
vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    doc: vi.fn(),
    deleteDoc: vi.fn(),
  };
});

// Mock uuid
vi.mock("uuid", () => ({
  v4: vi.fn().mockReturnValue("mocked--uuid"),
}));

// Mock formatDate
vi.mock("../..", () => ({
  formatDate: vi.fn(() => "formatted-date"),
}));

describe("getAllEmployees", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should return employees", async () => {
    const mockData = [
      { id: "1", name: "Employee 1" },
      { id: "2", name: "Employee 2" },
    ];

    (getDocs as Mock).mockReturnValue({
      docs: mockData.map((doc) => ({ data: () => doc })),
    });

    const employees = await getAllEmployees();
    expect(employees).toEqual(mockData);
    expect(collection).toHaveBeenCalledWith(db, "employees");
    expect(getDocs).toHaveBeenCalledOnce();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Firestore error");
    (getDocs as Mock).mockRejectedValue(error);
    const employeesCollection = {};
    (collection as Mock).mockReturnValue(employeesCollection);

    const employees = await getAllEmployees();

    expect(collection).toHaveBeenCalledWith(db, "employees");
    expect(getDocs).toHaveBeenCalledWith(employeesCollection);
    expect(employees).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading employees: ",
      error
    );
  });
});

describe("getEmployeeById", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    consoleLogSpy = vi.spyOn(console, "log");
  });
  const employeeId = "1";

  it("should return employee when employeeId has value", async () => {
    const employeeData = {
      id: employeeId,
      name: "Employee 1",
    };

    const employeesCollection = {};
    (collection as Mock).mockReturnValue(employeesCollection);
    const q = "";
    (query as Mock).mockReturnValue(q);
    const querySnapshot = {
      empty: false,
      docs: [{ data: () => employeeData }],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);

    const result = await getEmployeeById(employeeId);

    expect(consoleLogSpy).not.toHaveBeenCalledWith("Employee ID is empty");
    expect(collection).toHaveBeenCalledWith(db, "employees");
    expect(where).toHaveBeenCalledWith("id", "==", employeeId);
    expect(query).toHaveBeenCalledWith(
      employeesCollection,
      where("id", "==", employeeId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalledWith("No matching documents.");
    expect(consoleLogSpy).toHaveBeenCalledWith("Employee data: ", employeeData);
    expect(result).toEqual(employeeData);
  });
  it("should return undefined if employeeId is falsy", async () => {
    const result = await getEmployeeById("");
    expect(consoleLogSpy).toHaveBeenCalledWith("Employee ID is empty");
    expect(result).toBeUndefined();
  });
  it("should return null if querySnapshot is empty", async () => {
    const employeesCollection = {};
    (collection as Mock).mockReturnValue(employeesCollection);
    const q = "";
    (query as Mock).mockReturnValue(q);

    const querySnapshot = {
      empty: true,
      docs: [],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const result = await getEmployeeById(employeeId);
    expect(consoleLogSpy).not.toHaveBeenCalledWith("Employee ID is empty");
    expect(collection).toHaveBeenCalledWith(db, "employees");
    expect(query).toHaveBeenCalledWith(
      employeesCollection,
      where("id", "==", employeeId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
    expect(result).toBeNull();
  });
  it("should manage thrown error correctly", async () => {
    const employeesCollection = {};
    (collection as Mock).mockReturnValue(employeesCollection);
    const q = "";
    (query as Mock).mockReturnValue(q);

    const error = new Error("Error message");
    (getDocs as Mock).mockRejectedValue(error);

    const result = await getEmployeeById(employeeId);

    expect(consoleLogSpy).not.toHaveBeenCalledWith("Employee ID is empty");
    expect(collection).toHaveBeenCalledWith(db, "employees");
    expect(query).toHaveBeenCalledWith(
      employeesCollection,
      where("id", "==", employeeId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalledWith("No matching documents.");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading employee: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("getAllEmployeeIds", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log");
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  const employeeIds = [1, 2];
  it("should return employee ids", async () => {
    const mockEmployeeDocs = employeeIds.map((id) => ({
      data: () => ({
        id,
      }),
    }));
    const employeesCollection = {};
    (collection as Mock).mockReturnValue(employeesCollection);
    const querySnapshot = {
      docs: mockEmployeeDocs,
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);

    const result = await getAllEmployeeIds();
    expect(collection).toHaveBeenCalledWith(db, "employees");
    expect(getDocs).toHaveBeenCalledWith(employeesCollection);
    expect(consoleLogSpy).toHaveBeenCalledWith("Employee IDs: ", employeeIds);
    expect(result).toEqual(employeeIds);
  });
  it("should manage errors correctly", async () => {
    const employeesCollection = {};
    (collection as Mock).mockReturnValue(employeesCollection);
    const error = new Error("Error message");
    (getDocs as Mock).mockRejectedValue(error);

    const result = await getAllEmployeeIds();
    expect(collection).toHaveBeenCalledWith(db, "employees");
    expect(getDocs).toHaveBeenCalledWith(employeesCollection);
    expect(consoleLogSpy).not.toHaveBeenCalledWith(
      "Employee IDs: ",
      employeeIds
    );
    expect(result).not.toEqual(employeeIds);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading employee IDs: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("handleCreateEmployee", () => {
  const dummyValues = {
    name: "Test Employee",
    email: "test@example.com",
  } as EmployeeFormValues;
  const formikHelpers = {
    resetForm: vi.fn(),
  } as unknown as FormikHelpers<EmployeeFormValues>;

  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should create a new employee successfully", async () => {
    const docRef = { id: "1" };
    (addDoc as Mock).mockReturnValue(docRef);
    const result = await handleCreateEmployee(dummyValues, formikHelpers);
    expect(addDoc).toHaveBeenCalledWith(collection(db, "employees"), {
      ...dummyValues,
      createdAt: formatDate(new Date()),
    });
    expect(updateDoc).toHaveBeenCalledWith(docRef, { id: docRef.id });
    expect(toast.success).toHaveBeenCalledWith("Employee created");
    expect(formikHelpers.resetForm).toHaveBeenCalled();
    expect(result).toBeUndefined();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (addDoc as Mock).mockRejectedValue(error);
    const result = await handleCreateEmployee(dummyValues, formikHelpers);
    expect(addDoc).toHaveBeenCalledWith(collection(db, "employees"), {
      ...dummyValues,
      createdAt: formatDate(new Date()),
    });
    expect(updateDoc).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(formikHelpers.resetForm).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});

describe("handleEditEmployee", () => {
  const selectedEmployeeId = "1";
  const values = {
    name: "test employee",
    email: "test@email.com",
  } as EmployeeFormValues;
  const formikHelpers = {
    resetForm: vi.fn(),
  } as unknown as FormikHelpers<EmployeeFormValues>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log");
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should update employee successfully", async () => {
    const employeesCollection = "employeesCollection";
    (collection as Mock).mockReturnValue(employeesCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);
    const documentId = "1";
    const querySnapshot = {
      empty: false,
      docs: [{ id: documentId }],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const employeeDocRef = "employeeDocRef";
    (doc as Mock).mockReturnValue(employeeDocRef);
    const result = await handleEditEmployee(
      selectedEmployeeId,
      values,
      formikHelpers
    );
    expect(collection).toHaveBeenCalledWith(db, "employees");
    expect(query).toHaveBeenCalledWith(
      employeesCollection,
      where("id", "==", selectedEmployeeId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "employees", documentId);
    expect(updateDoc).toHaveBeenCalledWith(employeeDocRef, {
      ...values,
      updatedAt: formatDate(new Date()),
    });
    expect(toast.success).toHaveBeenCalledWith("Employee updated");
    expect(formikHelpers.resetForm).toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
  it("should return null and don't update if document not found", async () => {
    const employeesCollection = "employeesCollection";
    (collection as Mock).mockReturnValue(employeesCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);
    const querySnapshot = {
      empty: true,
      docs: [],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const result = await handleEditEmployee(
      selectedEmployeeId,
      values,
      formikHelpers
    );
    expect(collection).toHaveBeenCalledWith(db, "employees");
    expect(query).toHaveBeenCalledWith(
      employeesCollection,
      where("id", "==", selectedEmployeeId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
    expect(result).toBeNull();
    expect(doc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(formikHelpers.resetForm).not.toHaveBeenCalled();
  });
  it("should manage errors correctly", async () => {
    const employeesCollection = "employeesCollection";
    (collection as Mock).mockReturnValue(employeesCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);

    const error = new Error("Test error");
    (getDocs as Mock).mockRejectedValue(error);
    const result = await handleEditEmployee(
      selectedEmployeeId,
      values,
      formikHelpers
    );
    expect(collection).toHaveBeenCalledWith(db, "employees");
    expect(query).toHaveBeenCalledWith(
      employeesCollection,
      where("id", "==", selectedEmployeeId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(doc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(formikHelpers.resetForm).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error updating employee: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("deleteEmployeeById", () => {
  const employeeId = "1";

  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log");
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should delete employee successfully", async () => {
    const employeesCollection = "employeesCollection";
    (collection as Mock).mockReturnValue(employeesCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);
    const documentId = "1";
    const querySnapshot = {
      empty: false,
      docs: [{ id: documentId }],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const employeeDocRef = "employeeDocRef";
    (doc as Mock).mockReturnValue(employeeDocRef);

    const result = await deleteEmployeeById(employeeId);
    expect(collection).toHaveBeenCalledWith(db, "employees");
    expect(query).toHaveBeenCalledWith(
      employeesCollection,
      where("id", "==", employeeId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "employees", documentId);
    expect(deleteDoc).toHaveBeenCalledWith(employeeDocRef);
    expect(toast.success).toHaveBeenCalledWith("Employee deleted");
    expect(result).toBeUndefined();
  });
  it("should return null and don't delete employee if document not found", async () => {
    const employeesCollection = "employeesCollection";
    (collection as Mock).mockReturnValue(employeesCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);
    const querySnapshot = {
      empty: true,
      docs: [],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const result = await deleteEmployeeById(employeeId);
    expect(collection).toHaveBeenCalledWith(db, "employees");
    expect(query).toHaveBeenCalledWith(
      employeesCollection,
      where("id", "==", employeeId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
    expect(result).toBeNull();
    expect(doc).not.toHaveBeenCalled();
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should manage errors correctly", async () => {
    const employeesCollection = "employeesCollection";
    (collection as Mock).mockReturnValue(employeesCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);
    const error = new Error("Test error");
    (getDocs as Mock).mockRejectedValue(error);

    const result = await deleteEmployeeById(employeeId);
    expect(collection).toHaveBeenCalledWith(db, "employees");
    expect(query).toHaveBeenCalledWith(
      employeesCollection,
      where("id", "==", employeeId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(doc).not.toHaveBeenCalled();
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error deleting employee: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
