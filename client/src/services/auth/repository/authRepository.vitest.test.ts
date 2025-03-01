import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import {
  firebaseLogin,
  firebaseLogout,
  firebaseOnAuthStateChanged,
  firebaseRegisterUser,
} from "./authRepository";
import * as firebaseAuth from "firebase/auth";
import { waitFor } from "@testing-library/react";
import { auth } from "../../../firebaseConfig";

vi.mock("firebase/auth", { spy: true });

describe("firebaseLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const credentials = {
    email: "email@email.com",
    password: "123456",
  };
  it("should return user", async () => {
    (firebaseAuth.signInWithEmailAndPassword as Mock).mockResolvedValue({
      user: { name: "Bart", id: "1" },
    });
    const result = await firebaseLogin(credentials.email, credentials.password);
    await waitFor(() => {
      expect(
        firebaseAuth.signInWithEmailAndPassword as Mock
      ).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toHaveProperty("user");
    });
  });
  it("should manage error and return undefined", async () => {
    const error = new Error("Test error");
    const consoleErrorSpy = vi.spyOn(console, "error");
    (firebaseAuth.signInWithEmailAndPassword as Mock).mockRejectedValue(error);
    const result = await firebaseLogin(credentials.email, credentials.password);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Login error: ", error);
      expect(result).toBeUndefined();
    });
  });
});

describe("firebaseRegisterUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const credentials = {
    email: "email@email.com",
    password: "123456",
  };
  it("should return user when register success", async () => {
    (firebaseAuth.createUserWithEmailAndPassword as Mock).mockResolvedValue({
      user: { name: "Bart", id: "1" },
    });
    const result = await firebaseRegisterUser(
      credentials.email,
      credentials.password
    );
    await waitFor(() => {
      expect(
        firebaseAuth.createUserWithEmailAndPassword as Mock
      ).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toHaveProperty("user");
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (firebaseAuth.createUserWithEmailAndPassword as Mock).mockRejectedValue(
      error
    );
    const consoleErrorSpy = vi.spyOn(console, "error");
    const result = await firebaseRegisterUser(
      credentials.email,
      credentials.password
    );

    await waitFor(() => {
      expect(
        firebaseAuth.createUserWithEmailAndPassword as Mock
      ).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith("Register error: ", error);
      expect(result).toBeUndefined();
    });
  });
});

describe("firebaseLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call signOut", async () => {
    await firebaseLogout();
    expect(firebaseAuth.signOut as Mock).toHaveBeenCalledWith(auth);
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (firebaseAuth.signOut as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    await firebaseLogout();
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Logout error: ", error);
    });
  });
});

describe("firebaseOnAuthStateChanged", () => {
  beforeEach(() => {});
  const callback = vi.fn();
  it("should call onAuthStateChanged", () => {
    firebaseOnAuthStateChanged(callback);
    expect(firebaseAuth.onAuthStateChanged).toHaveBeenCalledWith(
      auth,
      callback
    );
  });
});
