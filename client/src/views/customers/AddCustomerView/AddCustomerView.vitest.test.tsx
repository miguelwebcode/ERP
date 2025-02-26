vi.mock("react", () => ({
  useState: vi.fn(),
  useEffect: (cb: () => void) => cb(),
  useRef: vi.fn(),
  useMemo: () => false,
}));
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { AddCustomerView } from "./AddCustomerView";
import { useState, useRef } from "react";
import * as appStore from "../../../stores/app-store";
import { FormikProps } from "formik";
import { CustomerFormValues } from "../../../types/form-values-types";
import * as customersRepository from "../../../services/customers/repository/customersRepository";
import { db } from "../../../firebaseConfig";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

describe("AddCustomerView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(appStore, "useAppStore");
  });

  it("sets customer id to empty string and sets isRenderDone to true on first render", async () => {
    let mockIsRenderDone = false;
    const mockSetIsRenderDone = vi.fn();
    (useState as Mock).mockReturnValue([mockIsRenderDone, mockSetIsRenderDone]);
    const mockStore = { setSelectedCustomerId: vi.fn() };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockStore)
    );

    render(<AddCustomerView />);
    await waitFor(() => {
      expect(mockStore.setSelectedCustomerId).toHaveBeenCalledWith("");
      expect(mockSetIsRenderDone).toHaveBeenCalledWith(true);
      const title = screen.queryByText("NEW CUSTOMER");
      expect(title).not.toBeInTheDocument();
    });
  });

  it("renders CustomerForm with correct texts", async () => {
    let mockIsRenderDone = true;
    const mockSetIsRenderDone = vi.fn();
    (useState as Mock).mockReturnValue([mockIsRenderDone, mockSetIsRenderDone]);

    const mockFormikRef = {} as React.RefObject<
      FormikProps<CustomerFormValues>
    >;
    (useRef as Mock).mockReturnValue(mockFormikRef);

    render(<AddCustomerView />);
    await waitFor(() => {
      const title = screen.getByRole("heading", { name: "NEW CUSTOMER" });
      expect(title).toBeInTheDocument();
      expect(title).toBeInTheDocument();

      const inputAddress = screen.getByLabelText("Address") as HTMLInputElement;
      expect(inputAddress).toBeInTheDocument();
      expect(inputAddress.value).toBe("");

      const inputCompany = screen.getByLabelText("Company") as HTMLInputElement;
      expect(inputCompany).toBeInTheDocument();
      expect(inputCompany.value).toBe("");

      const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
      expect(inputEmail).toBeInTheDocument();
      expect(inputEmail.value).toBe("");

      const inputName = screen.getByLabelText("Name") as HTMLInputElement;
      expect(inputName).toBeInTheDocument();
      expect(inputName.value).toBe("");

      const inputPhone = screen.getByLabelText("Phone") as HTMLInputElement;
      expect(inputPhone).toBeInTheDocument();
      expect(inputPhone.value).toBe("");

      const inputProject = screen.getByLabelText("Project") as HTMLInputElement;
      expect(inputProject).toBeInTheDocument();
      expect(inputProject.value).toBe("");

      const button = screen.getByText("CREATE CUSTOMER");
      expect(button).toBeInTheDocument();
    });
  });
  it("creates a new customer successfully", async () => {
    vi.spyOn(customersRepository, "handleCreateCustomer");
    const isRenderDone = true;
    const setIsRenderDone = vi.fn();
    (useState as Mock).mockReturnValueOnce([isRenderDone, setIsRenderDone]);

    const mockStore = { setSelectedCustomerId: vi.fn() };
    (appStore.useAppStore as unknown as Mock).mockImplementationOnce(
      (selector) => selector(mockStore)
    );
    const formikRef = { current: true };
    (useRef as Mock).mockReturnValue(formikRef);
    render(<AddCustomerView />);

    const customerData = {
      createdAt: "19/02/2025 13:53",
      address: "fake Address",
      phone: "123456789",
      name: "fake Name",
      project: "fake Project",
      company: "fake Company",
      email: "fakeemail@email.com",
    };

    const title = screen.getByRole("heading", { name: "NEW CUSTOMER" });
    expect(title).toBeInTheDocument();
    expect(title).toBeInTheDocument();

    const inputAddress = screen.getByLabelText("Address") as HTMLInputElement;
    expect(inputAddress).toBeInTheDocument();
    expect(inputAddress.value).toBe("");
    fireEvent.change(inputAddress, { target: { value: customerData.address } });
    expect(inputAddress.value).toBe(customerData.address);

    const inputCompany = screen.getByLabelText("Company") as HTMLInputElement;
    expect(inputCompany).toBeInTheDocument();
    expect(inputCompany.value).toBe("");
    fireEvent.change(inputCompany, { target: { value: customerData.company } });
    expect(inputCompany.value).toBe(customerData.company);

    const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
    expect(inputEmail).toBeInTheDocument();
    expect(inputEmail.value).toBe("");
    fireEvent.change(inputEmail, { target: { value: "fakeemail@email.com" } });
    expect(inputEmail.value).toBe(customerData.email);

    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    expect(inputName).toBeInTheDocument();
    expect(inputName.value).toBe("");
    fireEvent.change(inputName, { target: { value: "fake Name" } });
    expect(inputName.value).toBe(customerData.name);

    const inputPhone = screen.getByLabelText("Phone") as HTMLInputElement;
    expect(inputPhone).toBeInTheDocument();
    expect(inputPhone.value).toBe("");
    fireEvent.change(inputPhone, { target: { value: "123456789" } });
    expect(inputPhone.value).toBe(customerData.phone);

    const inputProject = screen.getByLabelText("Project") as HTMLInputElement;
    expect(inputProject).toBeInTheDocument();
    expect(inputProject.value).toBe("");
    fireEvent.change(inputProject, { target: { value: "fake Project" } });
    expect(inputProject.value).toBe(customerData.project);

    const button = screen.getByText("CREATE CUSTOMER");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    await waitFor(async () => {
      const customersRef = collection(db, "customers");
      const q = query(customersRef, where("email", "==", customerData.email));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs[0]);
      const customerEmailExists = !querySnapshot.empty;
      expect(customerEmailExists).toBe(true);
      expect(customersRepository.handleCreateCustomer).toHaveBeenCalled();

      // Saves deletion promises to promise array, then waits for
      // all promises to complete
      const deletionPromises: Promise<void>[] = [];
      querySnapshot.forEach((doc) => {
        deletionPromises.push(deleteDoc(doc.ref));
      });
      await Promise.all(deletionPromises);
    });
  });
});
