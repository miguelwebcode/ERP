import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { DeleteCustomerView } from "./DeleteCustomerView";
import * as appStore from "../../stores/app-store";
import * as customersModule from "../../services/customers/customers";
import { useState, useRef } from "react";
import { Customer } from "../../types";

vi.mock("react", async () => {
  const actualReact = await vi.importActual("react");
  return {
    ...actualReact,
    useState: vi.fn(),
    useRef: vi.fn(),
  };
});
describe("DeleteCustomerView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(appStore, "useAppStore");
    vi.spyOn(customersModule, "fetchCustomer");
  });

  it("sets customer id to empty string on first render", async () => {
    const mockSelectedCustomer = {};
    const mockSetSelectedCustomer = vi.fn();
    (useState as Mock).mockReturnValue([
      mockSelectedCustomer,
      mockSetSelectedCustomer,
    ]);

    const mockAppStore = {
      selectedCustomerId: "",
      setSelectedCustomerId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockAppStore)
    );

    // const mockFetchCustomer = vi.fn();
    (useRef as Mock).mockImplementation(() => ({ current: true }));

    const mockCustomerIds = ["1", "2", "3"];
    const mockSetCustomerIds = vi.fn();
    (useState as Mock).mockReturnValue([mockCustomerIds, mockSetCustomerIds]);
    render(<DeleteCustomerView />);

    await waitFor(() => {
      expect(mockAppStore.setSelectedCustomerId).toHaveBeenCalledWith("");
    });
  });

  it("calls fetchCustomer on second render", async () => {
    const mockSelectedCustomer = {};
    const mockSetSelectedCustomer = vi.fn();
    (useState as unknown as Mock).mockReturnValue([
      mockSelectedCustomer,
      mockSetSelectedCustomer,
    ]);

    const mockAppStore = {
      selectedCustomerId: "1",
      setSelectedCustomerId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockAppStore)
    );

    (useRef as Mock).mockImplementation(() => ({ current: false }));

    const mockCustomerIds = ["1", "2", "3"];
    const mockSetCustomerIds = vi.fn();
    (useState as Mock).mockReturnValue([mockCustomerIds, mockSetCustomerIds]);

    render(<DeleteCustomerView />);

    await waitFor(() => {
      expect(customersModule.fetchCustomer).toHaveBeenCalled();
    });
  });

  it("shows correct texts", async () => {
    const mockSelectedCustomer = {};
    const mockSetSelectedCustomer = vi.fn();
    (useState as unknown as Mock).mockReturnValue([
      mockSelectedCustomer,
      mockSetSelectedCustomer,
    ]);

    const mockAppStore = {
      selectedCustomerId: "1",
      setSelectedCustomerId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockAppStore)
    );

    (useRef as Mock).mockImplementation(() => ({ current: false }));

    const mockCustomerIds = ["1", "2", "3"];
    const mockSetCustomerIds = vi.fn();
    (useState as Mock).mockReturnValue([mockCustomerIds, mockSetCustomerIds]);

    render(<DeleteCustomerView />);

    await waitFor(() => {
      const titleSelectCustomer = screen.getByRole("heading", {
        name: /select customer/i,
      });
      expect(titleSelectCustomer).toBeInTheDocument();

      const selectCustomerId = screen.getByLabelText(
        /customer id/i
      ) as HTMLSelectElement;
      expect(selectCustomerId.value).toBe("");

      const buttonSelectCustomer = screen.getByRole("button", {
        name: /fetch customer/i,
      });
      expect(buttonSelectCustomer).toBeInTheDocument();

      const buttonDeleteCustomer = screen.getByRole("button", {
        name: /delete customer/i,
      });
      expect(buttonDeleteCustomer).toBeInTheDocument();
    });
  });
  it("shows correct texts", async () => {
    const mockSelectedCustomer = {};
    const mockSetSelectedCustomer = vi.fn();
    (useState as unknown as Mock).mockReturnValue([
      mockSelectedCustomer,
      mockSetSelectedCustomer,
    ]);

    const mockAppStore = {
      selectedCustomerId: "1",
      setSelectedCustomerId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockAppStore)
    );

    (useRef as Mock).mockImplementation(() => ({ current: false }));

    const mockCustomerIds = ["1", "2", "3"];
    const mockSetCustomerIds = vi.fn();
    (useState as Mock).mockReturnValue([mockCustomerIds, mockSetCustomerIds]);

    render(<DeleteCustomerView />);

    await waitFor(() => {
      const titleSelectCustomer = screen.getByRole("heading", {
        name: /select customer/i,
      });
      expect(titleSelectCustomer).toBeInTheDocument();

      const selectCustomerId = screen.getByLabelText(
        /customer id/i
      ) as HTMLSelectElement;
      expect(selectCustomerId.value).toBe("");

      const buttonSelectCustomer = screen.getByRole("button", {
        name: /fetch customer/i,
      });
      expect(buttonSelectCustomer).toBeInTheDocument();

      const buttonDeleteCustomer = screen.getByRole("button", {
        name: /delete customer/i,
      });
      expect(buttonDeleteCustomer).toBeInTheDocument();
    });
  });
});
