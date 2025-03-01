import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import * as authRepository from "../repository/authRepository";
import { login, logout, registerUser, watchAuthState } from "./authService";
import { waitFor } from "@testing-library/react";
import * as firebaseAuth from "firebase/auth";
import { auth } from "../../../firebaseConfig";

vi.mock("../repository/authRepository", { spy: true });
vi.mock("firebase/auth", { spy: true });

describe("login", () => {
  beforeEach(() => {});
  const credentials = {
    email: "email@email.com",
    password: "123456",
  };
  it("should return an user after successfull login", async () => {
    const userCredential = { user: { name: "Bart", id: "1" } };
    (authRepository.firebaseLogin as Mock).mockResolvedValue(userCredential);
    const consoleLogSpy = vi.spyOn(console, "log");
    const result = await login(credentials.email, credentials.password);
    await waitFor(() => {
      expect(authRepository.firebaseLogin).toHaveBeenCalledWith(
        credentials.email,
        credentials.password
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "User signed in: ",
        userCredential.user
      );
      expect(result).toBe(userCredential.user);
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (authRepository.firebaseLogin as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    const result = await login(credentials.email, credentials.password);
    await waitFor(() => {
      expect(authRepository.firebaseLogin).toHaveBeenCalledWith(
        credentials.email,
        credentials.password
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error signing in: ", error);
      expect(result).toBeUndefined();
    });
  });
});

describe("watchAuthState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const callback = vi.fn();

  it("should call functions and callback", () => {
    watchAuthState(callback);
    expect(authRepository.firebaseOnAuthStateChanged).toHaveBeenCalled();
  });
});

describe("logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should call logout service repository function and log a message", async () => {
    const consoleLogSpy = vi.spyOn(console, "log");

    await logout();
    await waitFor(() => {
      expect(authRepository.firebaseLogout).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith("User signed out");
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (authRepository.firebaseLogout as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    await logout();
    await waitFor(() => {
      expect(authRepository.firebaseLogout).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error signing out: ",
        error
      );
    });
  });
});

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const credentials = { email: "email@email.com", password: "111111" };

  it("should call register service, log a message and return an user", async () => {
    const userCredential = { user: { name: "Bart" } };
    (authRepository.firebaseRegisterUser as Mock).mockResolvedValue(
      userCredential
    );
    const consoleLogSpy = vi.spyOn(console, "log");
    const result = await registerUser(credentials.email, credentials.password);
    await waitFor(() => {
      expect(authRepository.firebaseRegisterUser).toHaveBeenCalledWith(
        credentials.email,
        credentials.password
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "User registered: ",
        userCredential.user
      );
      expect(result).toBe(userCredential.user);
    });
  });
  it("should manage errors correctly", async () => {
    const error = new Error("Test error");
    (authRepository.firebaseRegisterUser as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    const result = await registerUser(credentials.email, credentials.password);
    await waitFor(() => {
      expect(authRepository.firebaseRegisterUser).toHaveBeenCalledWith(
        credentials.email,
        credentials.password
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error registering user: ",
        error
      );
      expect(result).toBeUndefined();
    });
  });
});
