vi.mock("react", () => ({
  useState: vi.fn(),
  useEffect: (cb: () => void) => cb(),
  useRef: vi.fn(),
  useMemo: () => false,
}));
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { AddCustomerView } from "./AddCustomerView";
import { useState, useRef } from "react";
import * as appStore from "../../../stores/app-store";
import { FormikProps } from "formik";
import { CustomerFormValues } from "../../../types/form-values-types";

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
});
