import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import * as appStore from "../../../stores/app-store";
import { useState, useRef } from "react";
import EditCustomerView from "./EditCustomerView";

vi.mock("react", async () => {
  const actualReact = await vi.importActual("react");
  return {
    ...actualReact,
    useState: vi.fn(),
    useRef: vi.fn(),
  };
});

describe("EditCustomerView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(appStore, "useAppStore");
  });

  it("sets customer id to empty string and isRenderDone to true on first render", async () => {
    const mockIsRenderDone = false;
    const mockSetIsRenderDone = vi.fn();
    (useState as Mock).mockReturnValue([mockIsRenderDone, mockSetIsRenderDone]);

    const mockStore = {
      selectedCustomerId: "",
      setSelectedCustomerId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockStore)
    );

    render(<EditCustomerView />);

    await waitFor(() => {
      expect(mockStore.setSelectedCustomerId).toHaveBeenCalledWith("");
      expect(mockSetIsRenderDone).toHaveBeenCalledWith(true);
    });
  });

  it("shows correct texts, select customer is enabled, customer form inputs are disabled", async () => {
    const mockIsRenderDone = true;
    const mockSetIsRenderDone = vi.fn();
    (useState as Mock).mockReturnValue([mockIsRenderDone, mockSetIsRenderDone]);

    const mockStore = {
      selectedCustomerId: "",
      setSelectedCustomerId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockStore)
    );

    const mockCustomerIds = ["1", "2", "3"];
    const mockSetCustomerIds = vi.fn();
    (useState as Mock).mockReturnValue([mockCustomerIds, mockSetCustomerIds]);

    (useRef as Mock).mockImplementation(() => ({ current: false }));

    render(<EditCustomerView />);

    await waitFor(() => {
      // SelectCustomerForm texts

      const titleSelectCustomer = screen.getByRole("heading", {
        name: /select customer/i,
      });
      expect(titleSelectCustomer).toBeInTheDocument();

      const selectCustomerId = screen.getByLabelText(
        /customer id/i
      ) as HTMLSelectElement;
      expect(selectCustomerId.value).toBe("");
      expect(selectCustomerId.disabled).toBe(false);

      const buttonSelectCustomer = screen.getByRole("button", {
        name: /fetch customer/i,
      }) as HTMLButtonElement;
      expect(buttonSelectCustomer).toBeInTheDocument();
      expect(buttonSelectCustomer.disabled).toBe(false);
    });

    // CustomerForm
    const titleCustomerForm = screen.getByRole("heading", {
      name: /Edit Customer/i,
    });
    expect(titleCustomerForm).toBeInTheDocument();

    const inputAddress = screen.getByLabelText("Address") as HTMLInputElement;
    expect(inputAddress).toBeInTheDocument();
    expect(inputAddress.value).toBe("");
    expect(inputAddress.disabled).toBe(true);

    const inputCompany = screen.getByLabelText("Company") as HTMLInputElement;
    expect(inputCompany).toBeInTheDocument();
    expect(inputCompany.value).toBe("");
    expect(inputCompany.disabled).toBe(true);

    const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
    expect(inputEmail).toBeInTheDocument();
    expect(inputEmail.value).toBe("");
    expect(inputEmail.disabled).toBe(true);

    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    expect(inputName).toBeInTheDocument();
    expect(inputName.value).toBe("");
    expect(inputName.disabled).toBe(true);

    const inputPhone = screen.getByLabelText("Phone") as HTMLInputElement;
    expect(inputPhone).toBeInTheDocument();
    expect(inputPhone.value).toBe("");
    expect(inputPhone.disabled).toBe(true);

    const inputProject = screen.getByLabelText("Project") as HTMLInputElement;
    expect(inputProject).toBeInTheDocument();
    expect(inputProject.value).toBe("");
    expect(inputProject.disabled).toBe(true);

    const buttonUpdateCustomer = screen.getByRole("button", {
      name: /update customer/i,
    });
    expect(buttonUpdateCustomer).toBeInTheDocument();
  });
});
