import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { ReadCustomersView } from "./ReadCustomersView";
import * as customerService from "../../../services/customers/customersService";
import { useState } from "react";
import { Customer } from "../../../types";

vi.mock("react", async () => {
  const actualReact = await vi.importActual("react");
  return {
    ...actualReact,
    useState: vi.fn(),
  };
});

describe("ReadCustomersView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(customerService, "fetchAllCustomers");
  });

  it("calls fetchAllCustomers on first render", async () => {
    const mockCustomers: Customer[] = [
      {
        address: "123 Main St",
        company: "ACME Inc",
        customerId: "cust123",
        email: "john@example.com",
        name: "John Doe",
        phone: "555-1234",
        project: "Project X",
        createdAt: "2025-02-15T00:00:00Z",
        updatedAt: "2025-02-16T00:00:00Z",
      },
    ];
    const mockSetCustomers = vi.fn();
    (useState as Mock).mockReturnValue([mockCustomers, mockSetCustomers]);
    render(<ReadCustomersView />);

    await waitFor(() => {
      expect(customerService.fetchAllCustomers).toHaveBeenCalledWith(
        mockSetCustomers
      );
    });
  });
  it("shows correct card texts and customer texts", async () => {
    const mockCustomers: Customer[] = [
      {
        address: "123 Main St",
        company: "ACME Inc",
        customerId: "cust123",
        email: "john@example.com",
        name: "John Doe",
        phone: "555-1234",
        project: "Project X",
        createdAt: "2025-02-15T00:00:00Z",
        updatedAt: "2025-02-16T00:00:00Z",
      },
    ];
    const mockSetCustomers = vi.fn();
    (useState as Mock).mockReturnValue([mockCustomers, mockSetCustomers]);
    render(<ReadCustomersView />);

    await waitFor(() => {
      const fieldName = screen.getByText("Name");
      expect(fieldName).toBeInTheDocument();
      const valueName = screen.getByText("John Doe");
      expect(valueName).toBeInTheDocument();

      const fieldEmail = screen.getByText("Email");
      expect(fieldEmail).toBeInTheDocument();
      const valueEmail = screen.getByText("john@example.com");
      expect(valueEmail).toBeInTheDocument();

      const fieldPhone = screen.getByText("Phone");
      expect(fieldPhone).toBeInTheDocument();
      const valuePhone = screen.getByText("555-1234");
      expect(valuePhone).toBeInTheDocument();

      const fieldAddress = screen.getByText("Address");
      expect(fieldAddress).toBeInTheDocument();
      const valueAddress = screen.getByText("123 Main St");
      expect(valueAddress).toBeInTheDocument();

      const fieldCompany = screen.getByText("Company");
      expect(fieldCompany).toBeInTheDocument();
      const valueCompany = screen.getByText("ACME Inc");
      expect(valueCompany).toBeInTheDocument();

      const fieldProject = screen.getByText("Project");
      expect(fieldProject).toBeInTheDocument();
      const valueProject = screen.getByText("Project X");
      expect(valueProject).toBeInTheDocument();

      const fieldCreatedAt = screen.getByText("Created at");
      expect(fieldCreatedAt).toBeInTheDocument();
      const valueCreatedAt = screen.getByText("2025-02-15T00:00:00Z");
      expect(valueCreatedAt).toBeInTheDocument();

      const fieldUpdatedAt = screen.getByText("Updated at");
      expect(fieldUpdatedAt).toBeInTheDocument();
      const valueUpdatedAt = screen.getByText("2025-02-16T00:00:00Z");
      expect(valueUpdatedAt).toBeInTheDocument();
    });
  });
});
