import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { CustomersView } from "./CustomersView";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("CustomersView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    render(<CustomersView />);
  });

  it("renders all texts correctly", () => {
    const mainTitle = screen.getByRole("heading", { name: "CUSTOMERS" });
    expect(mainTitle).toBeInTheDocument();
    const cardTitle = screen.getByRole("heading", {
      name: /manage customers/i,
    });
    expect(cardTitle).toBeInTheDocument();
    const buttonCreate = screen.getByRole("button", {
      name: /create/i,
    });
    expect(buttonCreate).toBeInTheDocument();
    const buttonRead = screen.getByRole("button", {
      name: /read/i,
    });
    expect(buttonRead).toBeInTheDocument();
    const buttonUpdate = screen.getByRole("button", {
      name: /update/i,
    });
    expect(buttonUpdate).toBeInTheDocument();
    const buttonDelete = screen.getByRole("button", {
      name: /delete/i,
    });
    expect(buttonDelete).toBeInTheDocument();
  });
  it("buttons call their function", async () => {
    const buttonCreate = screen.getByRole("button", {
      name: /create/i,
    });
    const buttonRead = screen.getByRole("button", {
      name: /read/i,
    });
    const buttonUpdate = screen.getByRole("button", {
      name: /update/i,
    });
    const buttonDelete = screen.getByRole("button", {
      name: /delete/i,
    });
    fireEvent.click(buttonCreate);
    fireEvent.click(buttonRead);
    fireEvent.click(buttonUpdate);
    fireEvent.click(buttonDelete);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/customers/add");
      expect(mockNavigate).toHaveBeenCalledWith("/customers/read");
      expect(mockNavigate).toHaveBeenCalledWith("/customers/edit");
      expect(mockNavigate).toHaveBeenCalledWith("/customers/delete");
    });
  });
});
