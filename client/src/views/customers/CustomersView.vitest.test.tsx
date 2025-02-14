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
    const title = screen.getByRole("heading", { name: "Customer CRUD" });
    expect(title).toBeInTheDocument();
    const buttonCreateCustomer = screen.getByRole("button", {
      name: /create customer/i,
    });
    expect(buttonCreateCustomer).toBeInTheDocument();
    const buttonReadCustomers = screen.getByRole("button", {
      name: /read customers/i,
    });
    expect(buttonReadCustomers).toBeInTheDocument();
    const buttonUpdateCustomer = screen.getByRole("button", {
      name: /update customer/i,
    });
    expect(buttonUpdateCustomer).toBeInTheDocument();
    const buttonDeleteCustomer = screen.getByRole("button", {
      name: /delete customer/i,
    });
    expect(buttonDeleteCustomer).toBeInTheDocument();
  });
  it("buttons call their f unction", async () => {
    const buttonCreateCustomer = screen.getByRole("button", {
      name: /create customer/i,
    });
    const buttonReadCustomers = screen.getByRole("button", {
      name: /read customers/i,
    });
    const buttonUpdateCustomer = screen.getByRole("button", {
      name: /update customer/i,
    });
    const buttonDeleteCustomer = screen.getByRole("button", {
      name: /delete customer/i,
    });
    fireEvent.click(buttonCreateCustomer);
    fireEvent.click(buttonReadCustomers);
    fireEvent.click(buttonUpdateCustomer);
    fireEvent.click(buttonDeleteCustomer);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/customers/add");
      expect(mockNavigate).toHaveBeenCalledWith("/customers/read");
      expect(mockNavigate).toHaveBeenCalledWith("/customers/edit");
      expect(mockNavigate).toHaveBeenCalledWith("/customers/delete");
    });
  });
});
