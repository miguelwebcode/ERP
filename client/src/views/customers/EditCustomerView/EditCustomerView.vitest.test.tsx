import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import * as appStore from "../../../stores/app-store";
import { useState, useRef, act } from "react";
import EditCustomerView from "./EditCustomerView";
import { db } from "../../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

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

  it("shows correct texts, select customer button is enabled, customer form inputs are disabled", async () => {
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

  it("fetch customer, check texts on form, update customer, check successful update", async () => {
    const mockIsRenderDone = true;
    const mockSetIsRenderDone = vi.fn();
    (useState as Mock).mockReturnValueOnce([
      mockIsRenderDone,
      mockSetIsRenderDone,
    ]);

    const mockStore = {
      selectedCustomerId: "260cf13e-84ec-4fd3-98e3-17d745a2a708",
      setSelectedCustomerId: vi.fn(),
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockStore)
    );
    const mockCustomerIds = [
      "260cf13e-84ec-4fd3-98e3-17d745a2a708",
      "31ccef4f-ab5b-4ddb-b031-6877b3e12891",
    ];
    const mockSetCustomerIds = vi.fn();
    (useState as Mock).mockReturnValueOnce([
      mockCustomerIds,
      mockSetCustomerIds,
    ]);

    (useRef as Mock).mockImplementation(() => ({ current: true }));

    render(<EditCustomerView />);

    // SelectCustomerForm
    const selectCustomerId = screen.getByLabelText(
      /customer id/i
    ) as HTMLSelectElement;
    expect(selectCustomerId.value).toBe("");
    expect(selectCustomerId.disabled).toBe(false);
    // SELECT CUSTOMER ID
    act(() => {
      fireEvent.change(selectCustomerId, {
        target: { value: mockCustomerIds[0] },
      });
    });

    const buttonSelectCustomer = screen.getByRole("button", {
      name: /fetch customer/i,
    }) as HTMLButtonElement;

    // FETCH CUSTOMER
    act(() => {
      fireEvent.click(buttonSelectCustomer);
    });
    const customerData = {
      createdAt: "19/02/2025 13:53",
      address: "Customer2 Street",
      phone: "123456789",
      name: "Customer2",
      customerId: "260cf13e-84ec-4fd3-98e3-17d745a2a708",
      project: "Project2",
      company: "Customer2 Company",
      email: "customer2@email.com",
    };

    const titleCustomerForm = screen.getByRole("heading", {
      name: /Edit Customer/i,
    });
    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    const inputAddress = screen.getByLabelText("Address") as HTMLInputElement;
    const inputCompany = screen.getByLabelText("Company") as HTMLInputElement;
    const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
    const inputPhone = screen.getByLabelText("Phone") as HTMLInputElement;
    const inputProject = screen.getByLabelText("Project") as HTMLInputElement;
    const buttonUpdateCustomer = screen.getByRole("button", {
      name: /update customer/i,
    });

    await waitFor(async () => {
      // CustomerForm
      expect(titleCustomerForm).toBeInTheDocument();

      expect(inputAddress).toBeInTheDocument();
      expect(inputAddress.value).toBe(customerData.address);
      expect(inputAddress.disabled).toBe(false);

      expect(inputCompany).toBeInTheDocument();
      expect(inputCompany.value).toBe(customerData.company);
      expect(inputCompany.disabled).toBe(false);

      expect(inputEmail).toBeInTheDocument();
      expect(inputEmail.value).toBe(customerData.email);
      expect(inputEmail.disabled).toBe(false);

      expect(inputName).toBeInTheDocument();
      expect(inputName.value).toBe(customerData.name);
      expect(inputName.disabled).toBe(false);

      expect(inputPhone).toBeInTheDocument();
      expect(inputPhone.value).toBe(customerData.phone);
      expect(inputPhone.disabled).toBe(false);

      expect(inputProject).toBeInTheDocument();
      expect(inputProject.value).toBe(customerData.project);
      expect(inputProject.disabled).toBe(false);

      expect(buttonUpdateCustomer).toBeInTheDocument();
    });
    // CHANGE NAME TO NEW NAME
    const newName = "Agapito";
    act(() => {
      fireEvent.change(inputName, { target: { value: newName } });
    });

    // UPDATE CUSTOMER
    act(() => {
      fireEvent.click(buttonUpdateCustomer);
    });

    const customersRef = collection(db, "customers");
    const q = query(customersRef, where("name", "==", newName));
    await waitFor(async () => {
      const querySnapshot = await getDocs(q);
      expect(querySnapshot.empty).toBe(false);

      const updatePromises: Promise<void>[] = [];
      querySnapshot.forEach((doc) => {
        updatePromises.push(updateDoc(doc.ref, { name: customerData.name }));
      });
      await Promise.all(updatePromises);
    });
  });
});
