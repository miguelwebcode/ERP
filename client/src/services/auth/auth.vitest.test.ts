import { describe, it, expect, vi, Mock } from "vitest";
import { login } from "./auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(),
}));

vi.mock("../firebaseConfig", () => ({
  auth: vi.fn(),
}));

describe("login", () => {
  it("should sign in a user successfully", async () => {
    const mockUser = { uid: "12345", email: "email@email.com" };
    (signInWithEmailAndPassword as Mock).mockResolvedValueOnce({
      user: mockUser,
    });

    const user = await login("email@email.com", "123456");
    expect(user).toEqual(mockUser);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "email@email.com",
      "123456"
    );
  });

  it("should throw an error if sign in fails", async () => {
    const mockError = new Error("Invalid credentials");
    (signInWithEmailAndPassword as Mock).mockRejectedValueOnce(mockError);

    await expect(login("email@email.com", "wrongpassword")).rejects.toThrow(
      "Invalid credentials"
    );
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "email@email.com",
      "wrongpassword"
    );
  });
});
