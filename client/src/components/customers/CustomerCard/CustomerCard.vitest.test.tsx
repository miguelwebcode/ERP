import { render, screen } from "@testing-library/react";
import { CustomerCard } from "./CustomerCard";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { Customer } from "../../../types";

describe("CustomerCard", () => {
  it("renders all customer data except updatedAt", () => {
    const customer: Customer = {
      address: "street",
      company: "Corp",
      id: "CUST123456",
      email: "john.doe@techcorp.com",
      name: "name",
      phone: "+1-555-1234",
      createdAt: "2025-02-02 13:24",
      updatedAt: undefined,
    };

    render(<CustomerCard customer={customer} />);

    expect(screen.getByText(/street/i)).toBeInTheDocument();
    expect(screen.getByText("Corp")).toBeInTheDocument();
    expect(screen.getByText(/john.doe/i)).toBeInTheDocument();
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("+1-555-1234")).toBeInTheDocument();
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("2025-02-02 13:24")).toBeInTheDocument();
    expect(screen.queryByText(/updated at/i)).not.toBeInTheDocument();
  });
  it("renders all customer data AND updatedAt", () => {
    const customer: Customer = {
      address: "street",
      company: "Corp",
      id: "CUST123456",
      email: "john.doe@techcorp.com",
      name: "name",
      phone: "+1-555-1234",
      createdAt: "2025-02-02 13:24",
      updatedAt: "2025-02-03 23:24",
    };

    render(<CustomerCard customer={customer} />);

    expect(screen.getByText(/street/i)).toBeInTheDocument();
    expect(screen.getByText("Corp")).toBeInTheDocument();
    expect(screen.getByText(/john.doe/i)).toBeInTheDocument();
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("+1-555-1234")).toBeInTheDocument();
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("2025-02-02 13:24")).toBeInTheDocument();
    expect(screen.queryByText(/updated at/i)).toBeInTheDocument();
  });
});
