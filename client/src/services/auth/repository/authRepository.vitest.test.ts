import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { firebaseLogin } from "./authRepository";
import * as firebaseAuth from "firebase/auth";
import { waitFor } from "@testing-library/react";

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
