import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { getAllCustomers } from "./customers"; // Ajusta la ruta según tu estructura
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
