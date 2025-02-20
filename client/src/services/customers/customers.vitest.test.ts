import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { getAllCustomers, getCustomerById } from "./customers"; // Ajusta la ruta según tu estructura
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { User } from "firebase/auth";

// 🔹 Mockeamos Firebase Firestore y auth
vi.mock("../../firebaseConfig", () => ({
  auth: { currentUser: null },
  db: {},
}));

// Mock firestore functions
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
}));

describe("getAllCustomers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return customers when user is auth", async () => {
    // We simulate an authenticated user using spyOn on the currentUser getter
    vi.spyOn(auth, "currentUser", "get").mockReturnValue({
      uid: "123",
    } as User);

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

  it("should return undefined if user not auth", async () => {
    // Simulate no authenticated user by returning null
    vi.spyOn(auth, "currentUser", "get").mockReturnValue(null);

    const customers = await getAllCustomers();

    expect(customers).toBeUndefined();
    expect(getDocs).not.toHaveBeenCalled();
  });

  it("should manage errors correctly", async () => {
    vi.spyOn(auth, "currentUser", "get").mockReturnValue({
      uid: "123",
    } as User);

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

  it("should return customer when user auth and customerId has value", async () => {
    // Simulate auth user
    vi.spyOn(auth, "currentUser", "get").mockReturnValue({
      uid: "123",
    } as User);

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
  it("should return undefined if user not auth", async () => {
    vi.spyOn(auth, "currentUser", "get").mockReturnValue(null);

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const customer = await getCustomerById("99");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "User not authenticated. Cannot read from Firestore."
    );
    expect(customer).toBeUndefined();

    consoleErrorSpy.mockRestore();
  });
  it("should return undefined if customerId is falsy", async () => {
    vi.spyOn(auth, "currentUser", "get").mockReturnValue({
      uid: "123",
    } as User);

    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const customer = await getCustomerById("");
    expect(consoleLogSpy).toHaveBeenCalledWith("Customer ID is empty");
    expect(customer).toBeUndefined();
    consoleLogSpy.mockRestore();
  });
  it("should return null if query snapshot is empty", async () => {
    vi.spyOn(auth, "currentUser", "get").mockReturnValue({
      uid: "123",
    } as User);
    // Mock querySnapshot
    (getDocs as Mock).mockResolvedValue({ empty: true, docs: [] });
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const customer = await getCustomerById("1");
    expect(getDocs).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith("No matching documents.");
    expect(customer).toBeNull();
  });
  it("should manage thrown error correctly", async () => {
    vi.spyOn(auth, "currentUser", "get").mockReturnValue;

    (getDocs as Mock).mockRejectedValue(new Error("Firestore error"));
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const customer = await getCustomerById("1");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading customer: ",
      new Error("Firestore error")
    );
  });
});
