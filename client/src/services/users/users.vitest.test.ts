import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import * as firestoreMethods from "firebase/firestore";
import { getUsers, saveUserData } from "./users";
import { db } from "../../firebaseConfig";
import { waitFor } from "@testing-library/react";

vi.mock("firebase/firestore", { spy: true });

describe("saveUserData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const userData = {
    id: "idJuan",
    name: "Juan",
    role: "developer",
    email: "test@test.com",
  };
  it("should save a new user", async () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    await saveUserData("uid1", userData);
    const usersRef = firestoreMethods.collection(db, "users");
    const q = firestoreMethods.query(
      usersRef,
      firestoreMethods.where("id", "==", userData.id)
    );
    const querySnapshot = await firestoreMethods.getDocs(q);
    await waitFor(() => {
      expect(firestoreMethods.setDoc).toHaveBeenCalled();
      expect(firestoreMethods.doc).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith("User data saved");
      expect(querySnapshot.empty).toBe(false);
    });
  });
  it("should manage errors correctly", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error");
    const error = new Error("Test error");
    (firestoreMethods.setDoc as Mock).mockRejectedValue(error);
    await saveUserData("uid1", userData);
    await waitFor(() => {
      expect(firestoreMethods.setDoc).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error saving user data: ",
        error
      );
    });
  });
});

describe("getusers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get users", async () => {
    const result = await getUsers();
    await waitFor(() => {
      expect(firestoreMethods.collection).toHaveBeenCalledWith(db, "users");
      expect(firestoreMethods.getDocs).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (firestoreMethods.getDocs as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    const result = await getUsers();
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching users: ",
        error
      );
      expect(result).toBeUndefined();
    });
  });
});
