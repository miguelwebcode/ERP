import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import {
  deleteCustomerById,
  getAllCustomerIds,
  getAllCustomers,
  getCustomerById,
  handleCreateCustomer,
  handleEditCustomer,
} from "./customersRepository"; // Ajusta la ruta según tu estructura
import { db } from "../../../firebaseConfig";
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
import { formatDate } from "../..";
import { CustomerFormValues } from "../../../types/form-values-types";
import { FormikHelpers } from "formik";
import { toast } from "react-toastify";

vi.mock("react-toastify", { spy: true });

// Mock auth and db
vi.mock("../../../firebaseConfig", () => ({
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
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should return customers", async () => {
    const mockData = [
      { id: "1", name: "Customer 1" },
      { id: "2", name: "Customer 2" },
    ];

    (getDocs as Mock).mockReturnValue({
      docs: mockData.map((doc) => ({ data: () => doc })),
    });

    const customers = await getAllCustomers();
    expect(customers).toEqual(mockData);
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(getDocs).toHaveBeenCalledOnce();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("Firestore error");
    (getDocs as Mock).mockRejectedValue(error);
    const customersCollection = {};
    (collection as Mock).mockReturnValue(customersCollection);

    const customers = await getAllCustomers();

    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(getDocs).toHaveBeenCalledWith(customersCollection);
    expect(customers).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading customers: ",
      error
    );
  });
});

describe("getCustomerById", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    consoleLogSpy = vi.spyOn(console, "log");
  });
  const customerId = "1";

  it("should return customer when customerId has value", async () => {
    const customerData = {
      id: customerId,
      name: "Customer 1",
    };

    const customersCollection = {};
    (collection as Mock).mockReturnValue(customersCollection);
    const q = "";
    (query as Mock).mockReturnValue(q);
    const querySnapshot = {
      empty: false,
      docs: [{ data: () => customerData }],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);

    const result = await getCustomerById(customerId);

    expect(consoleLogSpy).not.toHaveBeenCalledWith("Customer ID is empty");
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(where).toHaveBeenCalledWith("id", "==", customerId);
    expect(query).toHaveBeenCalledWith(
      customersCollection,
      where("id", "==", customerId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalledWith("No matching documents.");
    expect(consoleLogSpy).toHaveBeenCalledWith("Customer data: ", customerData);
    expect(result).toEqual(customerData);
  });

  it("should return undefined if customerId is falsy", async () => {
    const result = await getCustomerById("");
    expect(consoleLogSpy).toHaveBeenCalledWith("Customer ID is empty");
    expect(result).toBeUndefined();
  });

  it("should return null if querySnapshot is empty", async () => {
    const customersCollection = {};
    (collection as Mock).mockReturnValue(customersCollection);
    const q = "";
    (query as Mock).mockReturnValue(q);

    const querySnapshot = {
      empty: true,
      docs: [],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const result = await getCustomerById(customerId);
    expect(consoleLogSpy).not.toHaveBeenCalledWith("Customer ID is empty");
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(query).toHaveBeenCalledWith(
      customersCollection,
      where("id", "==", customerId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
    expect(result).toBeNull();
  });

  it("should manage thrown error correctly", async () => {
    const customersCollection = {};
    (collection as Mock).mockReturnValue(customersCollection);
    const q = "";
    (query as Mock).mockReturnValue(q);

    const error = new Error("Error message");
    (getDocs as Mock).mockRejectedValue(error);

    const result = await getCustomerById(customerId);

    expect(consoleLogSpy).not.toHaveBeenCalledWith("Customer ID is empty");
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(query).toHaveBeenCalledWith(
      customersCollection,
      where("id", "==", customerId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalledWith("No matching documents.");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading customer: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
describe("getAllCustomerIds", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log");
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  const customerIds = [1, 2];
  it("should return customer ids", async () => {
    const mockCustomerDocs = customerIds.map((id) => ({
      data: () => ({
        id,
      }),
    }));
    const customersCollection = {};
    (collection as Mock).mockReturnValue(customersCollection);
    const querySnapshot = {
      docs: mockCustomerDocs,
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);

    const result = await getAllCustomerIds();
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(getDocs).toHaveBeenCalledWith(customersCollection);
    expect(consoleLogSpy).toHaveBeenCalledWith("Customer IDs: ", customerIds);
    expect(result).toEqual(customerIds);
  });

  it("should manage errors correctly", async () => {
    const customersCollection = {};
    (collection as Mock).mockReturnValue(customersCollection);
    const error = new Error("Error message");
    (getDocs as Mock).mockRejectedValue(error);

    const result = await getAllCustomerIds();
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(getDocs).toHaveBeenCalledWith(customersCollection);
    expect(consoleLogSpy).not.toHaveBeenCalledWith(
      "Customer IDs: ",
      customerIds
    );
    expect(result).not.toEqual(customerIds);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading customer IDs: ",
      error
    );
    expect(result).toBeUndefined();
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

  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should create a new customer successfully", async () => {
    const docRef = { id: "1" };
    (addDoc as Mock).mockReturnValue(docRef);
    const result = await handleCreateCustomer(dummyValues, formikHelpers);
    expect(addDoc).toHaveBeenCalledWith(collection(db, "customers"), {
      ...dummyValues,
      createdAt: formatDate(new Date()),
    });
    expect(updateDoc).toHaveBeenCalledWith(docRef, { id: docRef.id });
    expect(toast.success).toHaveBeenCalledWith("Customer created");
    expect(formikHelpers.resetForm).toHaveBeenCalled();
    expect(result).toBeUndefined();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (addDoc as Mock).mockRejectedValue(error);
    const result = await handleCreateCustomer(dummyValues, formikHelpers);
    expect(addDoc).toHaveBeenCalledWith(collection(db, "customers"), {
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
describe("handleEditCustomer", () => {
  const selectedCustomerId = "1";
  const values = {
    name: "Test Customer",
    email: "test@example.com",
  } as CustomerFormValues;
  const formikHelpers = {
    resetForm: vi.fn(),
  } as unknown as FormikHelpers<CustomerFormValues>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log");
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should update customer successfully", async () => {
    const customersCollection = "customersCollection";
    (collection as Mock).mockReturnValue(customersCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);
    const documentId = "1";
    const querySnapshot = {
      empty: false,
      docs: [{ id: documentId }],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const customerDocRef = "customerDocRef";
    (doc as Mock).mockReturnValue(customerDocRef);
    const result = await handleEditCustomer(
      selectedCustomerId,
      values,
      formikHelpers
    );
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(query).toHaveBeenCalledWith(
      customersCollection,
      where("id", "==", selectedCustomerId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "customers", documentId);
    expect(updateDoc).toHaveBeenCalledWith(customerDocRef, {
      ...values,
      updatedAt: formatDate(new Date()),
    });
    expect(toast.success).toHaveBeenCalledWith("Customer updated");
    expect(formikHelpers.resetForm).toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should return null and don't update if document not found", async () => {
    const customersCollection = "customersCollection";
    (collection as Mock).mockReturnValue(customersCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);
    const querySnapshot = {
      empty: true,
      docs: [],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const result = await handleEditCustomer(
      selectedCustomerId,
      values,
      formikHelpers
    );
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(query).toHaveBeenCalledWith(
      customersCollection,
      where("id", "==", selectedCustomerId)
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
    const customersCollection = "customersCollection";
    (collection as Mock).mockReturnValue(customersCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);

    const error = new Error("Test error");
    (getDocs as Mock).mockRejectedValue(error);
    const result = await handleEditCustomer(
      selectedCustomerId,
      values,
      formikHelpers
    );
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(query).toHaveBeenCalledWith(
      customersCollection,
      where("id", "==", selectedCustomerId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(doc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
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

  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log");
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should delete customer successfully", async () => {
    const customersCollection = "customersCollection";
    (collection as Mock).mockReturnValue(customersCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);
    const documentId = "1";
    const querySnapshot = {
      empty: false,
      docs: [{ id: documentId }],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const customerDocRef = "customerDocRef";
    (doc as Mock).mockReturnValue(customerDocRef);

    const result = await deleteCustomerById(customerId);
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(query).toHaveBeenCalledWith(
      customersCollection,
      where("id", "==", customerId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(db, "customers", documentId);
    expect(deleteDoc).toHaveBeenCalledWith(customerDocRef);
    expect(toast.success).toHaveBeenCalledWith("Customer deleted");
    expect(result).toBeUndefined();
  });

  it("should return null and don't delete customer if document not found", async () => {
    const customersCollection = "customersCollection";
    (collection as Mock).mockReturnValue(customersCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);
    const querySnapshot = {
      empty: true,
      docs: [],
    };
    (getDocs as Mock).mockReturnValue(querySnapshot);
    const result = await deleteCustomerById(customerId);
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(query).toHaveBeenCalledWith(
      customersCollection,
      where("id", "==", customerId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
    expect(result).toBeNull();
    expect(doc).not.toHaveBeenCalled();
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("should manage errors correctly", async () => {
    const customersCollection = "customersCollection";
    (collection as Mock).mockReturnValue(customersCollection);
    const q = "q";
    (query as Mock).mockReturnValue(q);

    const error = new Error("Test error");
    (getDocs as Mock).mockRejectedValue(error);
    const result = await deleteCustomerById(customerId);
    expect(collection).toHaveBeenCalledWith(db, "customers");
    expect(query).toHaveBeenCalledWith(
      customersCollection,
      where("id", "==", customerId)
    );
    expect(getDocs).toHaveBeenCalledWith(q);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(doc).not.toHaveBeenCalled();
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error deleting customer: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
