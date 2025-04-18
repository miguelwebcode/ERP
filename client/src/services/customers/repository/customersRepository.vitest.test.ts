import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import {
  deleteCustomerById,
  getAllCustomerIds,
  getAllCustomers,
  getCustomerById,
  handleCreateCustomer,
  handleEditCustomer,
} from "./customersRepository"; // Ajusta la ruta según tu estructura
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
} from "firebase/firestore";
import { User } from "firebase/auth";
import { formatDate } from "../..";
import { CustomerFormValues } from "../../../types/form-values-types";
import { FormikHelpers } from "formik";
import { v4 as uuidv4 } from "uuid";
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

describe("getAllCustomers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return customers", async () => {
    // Simulate getDocs returning data
    const mockData = [
      { id: "1", name: "Cliente 1" },
      { id: "2", name: "Cliente 2" },
    ];
    (getDocs as Mock).mockResolvedValue({
      docs: mockData.map((data) => ({ data: () => data })),
    });

    const customers = await getAllCustomers();

    expect(customers).toEqual(mockData);
    expect(getDocs).toHaveBeenCalledOnce();
    expect(collection).toHaveBeenCalledWith(db, "customers");
  });

  it("should manage errors correctly", async () => {
    // Simulate an error in getDocs
    (getDocs as Mock).mockRejectedValue(new Error("Firestore error"));

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const customers = await getAllCustomers();

    expect(customers).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading customers: ",
      new Error("Firestore error")
    );

    consoleErrorSpy.mockRestore();
  });
});

describe("getCustomerById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return customer when customerId has value", async () => {
    // Simulate getDocs returning customer
    const mockData = [{ id: "1", name: "Cliente 1" }];
    (getDocs as Mock).mockResolvedValue({
      docs: mockData.map((data) => ({ data: () => data })),
    });

    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const customer = await getCustomerById("1");

    expect(customer).toEqual(mockData[0]);
    expect(getDocs).toHaveBeenCalled();
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(consoleLogSpy).toHaveBeenCalledWith("Customer data: ", customer);
    consoleLogSpy.mockRestore();
  });

  it("should return undefined if customerId is falsy", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const customer = await getCustomerById("");
    expect(consoleLogSpy).toHaveBeenCalledWith("Customer ID is empty");
    expect(customer).toBeUndefined();
    consoleLogSpy.mockRestore();
  });
  it("should return null if query snapshot is empty", async () => {
    // Mock querySnapshot
    (getDocs as Mock).mockResolvedValue({ empty: true, docs: [] });
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const customer = await getCustomerById("1");
    expect(getDocs).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
    expect(customer).toBeNull();
  });
  it("should manage thrown error correctly", async () => {
    (getDocs as Mock).mockRejectedValue(new Error("Firestore error"));
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const customer = await getCustomerById("1");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading customer: ",
      new Error("Firestore error")
    );
    expect(customer).toBeUndefined();
  });
});
describe("getAllCustomerIds", () => {
  it("should return customer ids", async () => {
    const mockData = [
      { customerId: "1", name: "Customer 1" },
      { customerId: "2", name: "Customer 2" },
    ];
    (getDocs as Mock).mockResolvedValue({
      docs: mockData.map((data) => ({ data: () => data })),
    });
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const customerIds = await getAllCustomerIds();
    console.log(customerIds);
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(consoleLogSpy).toHaveBeenCalledWith("Customer IDs: ", customerIds);
    expect(customerIds).toEqual(mockData.map((data) => data.customerId));
  });

  it("should manage errors correctly", async () => {
    vi.spyOn(auth, "currentUser", "get").mockReturnValue({
      uid: "123",
    } as User);

    const mockError = new Error("Firestore error");
    (getDocs as Mock).mockRejectedValue(mockError);
    const consoleErrorSpy = vi.spyOn(console, "error");
    const customerIds = await getAllCustomerIds();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading customer IDs: ",
      mockError
    );
    expect(customerIds).toBeUndefined();
  });
});
describe("handleCreateCustomer", () => {
  const dummyValues = {
    name: "Test Customer",
    email: "test@example.com",
  } as CustomerFormValues;
  const formikHelpers = {
    resetForm: vi.fn(),
  } as unknown as FormikHelpers<CustomerFormValues>;

  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should create a new customer successfully", async () => {
    // Simulate that addDoc resolves successfully
    (addDoc as Mock).mockResolvedValue({});

    await handleCreateCustomer(dummyValues, formikHelpers);

    expect(addDoc).toHaveBeenCalled();
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(formatDate).toHaveBeenCalled();
    expect(uuidv4).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Customer created");
    expect(formikHelpers.resetForm).toHaveBeenCalled();
  });

  it("should manage errors correctly", async () => {
    const mockError = new Error("Test error");

    (addDoc as Mock).mockRejectedValue(mockError);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    await handleCreateCustomer(dummyValues, formikHelpers);

    expect(formikHelpers.resetForm).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error creating customer: ",
      mockError
    );
  });
});
describe("handleEditCustomer", async () => {
  const selectedCustomerId = "1";
  const values = {
    name: "Test Customer",
    email: "test@example.com",
  } as CustomerFormValues;
  const formikHelpers = {
    resetForm: vi.fn(),
  } as unknown as FormikHelpers<CustomerFormValues>;
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should update customer successfully", async () => {
    const mockData = [{ id: "1", name: "Customer 1" }];
    (getDocs as Mock).mockResolvedValue({
      empty: false,
      docs: mockData,
    });
    (doc as Mock).mockReturnValue("customerDocRef");

    const result = await handleEditCustomer(
      selectedCustomerId,
      values,
      formikHelpers
    );
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(where).toHaveBeenCalledWith("customerId", "==", selectedCustomerId);
    expect(query).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "customers", mockData[0].id);
    expect(updateDoc).toHaveBeenCalledWith("customerDocRef", {
      ...values,
      updatedAt: "formatted-date",
    });
    expect(toast.success).toHaveBeenCalledWith("Customer updated");
    expect(formikHelpers.resetForm).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should return null and don't update if document not found", async () => {
    (getDocs as Mock).mockResolvedValue({ empty: true, docs: [] });
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = await handleEditCustomer(
      selectedCustomerId,
      values,
      formikHelpers
    );
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(query).toHaveBeenCalled();
    expect(where).toHaveBeenCalledWith("customerId", "==", selectedCustomerId);
    expect(getDocs).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
    expect(result).toBeNull();
  });
  it("should handle errors correctly", async () => {
    const error = new Error("Test error");
    const consoleErrorSpy = vi.spyOn(console, "error");
    (getDocs as Mock).mockRejectedValue(error);
    const result = await handleEditCustomer(
      selectedCustomerId,
      values,
      formikHelpers
    );
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(query).toHaveBeenCalled();
    expect(where).toHaveBeenCalledWith("customerId", "==", selectedCustomerId);
    expect(getDocs).toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
    expect(formikHelpers.resetForm).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error updating customer: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
describe("deleteCustomerById", () => {
  const customerId = "1";
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it("should delete customer", async () => {
    const mockData = [{ id: "1", name: "Customer 1" }];
    (getDocs as Mock).mockResolvedValue({ empty: false, docs: mockData });
    const customerDocRef = "customerDocRef";
    (doc as Mock).mockReturnValue(customerDocRef);

    const result = await deleteCustomerById(customerId);
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(where).toHaveBeenCalledWith("customerId", "==", customerId);
    expect(getDocs).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "customers", mockData[0].id);
    expect(deleteDoc).toHaveBeenCalledWith(customerDocRef);
    expect(result).toBeUndefined();
  });

  it("should show console log and return null if empty query snapshot", async () => {
    (getDocs as Mock).mockResolvedValue({ empty: true, docs: [] });
    const consoleLogSpy = vi.spyOn(console, "log");
    const result = await deleteCustomerById(customerId);
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(where).toHaveBeenCalledWith("customerId", "==", customerId);
    expect(query).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
    expect(result).toBeNull();
    expect(doc).not.toHaveBeenCalled();
    expect(deleteDoc).not.toHaveBeenCalled();
  });
  it("should catch thrown error", async () => {
    const error = new Error("Test error");
    (getDocs as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    const result = await deleteCustomerById(customerId);
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(where).toHaveBeenCalledWith("customerId", "==", customerId);
    expect(query).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalled();
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error deleting customer: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
