import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { getUsers, saveUserData } from "./users";
import { db } from "../../firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

// Mock firestore functions
vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    doc: vi.fn(),
  };
});

describe("saveUserData", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log");
    consoleErrorSpy = vi.spyOn(console, "error");
  });
  const uid = "uid1";
  const userData = {
    id: "idJuan",
    name: "Juan",
    role: "developer",
    email: "test@test.com",
  };
  it("should save a new user", async () => {
    const result = await saveUserData(uid, userData);
    expect(setDoc).toHaveBeenCalledWith(doc(db, "users", uid), userData);
    expect(consoleLogSpy).toHaveBeenCalledWith("User data saved");
    expect(result).toBeUndefined();
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (setDoc as Mock).mockRejectedValue(error);
    const result = await saveUserData(uid, userData);
    expect(setDoc).toHaveBeenCalledWith(doc(db, "users", uid), userData);
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error saving user data: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("getUsers", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should get users", async () => {
    const usersRef = "usersRef";
    (collection as Mock).mockReturnValue(usersRef);
    const docsData = [
      { id: "1", name: "Juan" },
      { id: "2", name: "Paco" },
    ];
    const snapshot = {
      docs: [{ data: () => docsData[0] }, { data: () => docsData[1] }],
    };
    (getDocs as Mock).mockReturnValue(snapshot);
    const result = await getUsers();
    expect(collection).toHaveBeenCalledWith(db, "users");
    expect(getDocs).toHaveBeenCalledWith(usersRef);
    expect(result).toEqual(docsData);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
  it("should manage errors correctly", async () => {
    const usersRef = "usersRef";
    (collection as Mock).mockReturnValue(usersRef);
    const error = new Error("Test error");
    (getDocs as Mock).mockRejectedValue(error);
    const result = await getUsers();
    expect(collection).toHaveBeenCalledWith(db, "users");
    expect(getDocs).toHaveBeenCalledWith(usersRef);
    expect(result).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching users: ",
      error
    );
  });
});
