import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { LogoutButton } from "./LogoutButton";
import { logout } from "../../services/auth";

// TODO: Check again when more knowledge, TEST PASS

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../../services/auth", () => ({
  logout: vi.fn(),
}));

describe("LogoutButton", () => {
  it("should call logout and navigate to /login when clicked", () => {
    const mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);

    render(<LogoutButton />);

    const button = screen.getByText("Logout");
    fireEvent.click(button);

    expect(logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
