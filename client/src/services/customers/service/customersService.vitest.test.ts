import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import {
  fetchAllCustomers,
  fetchCustomer,
  fetchCustomerIds,
  handleDeleteCustomer,
  setCustomerFormValues,
} from "./customersService";
import {
  getAllCustomerIds,
  getCustomerById,
  getAllCustomers,
  deleteCustomerById,
} from "../repository/customersRepository";
import { FormikProps } from "formik";
import { CustomerFormValues } from "../../../types/form-values-types";

vi.mock("../repository/customersRepository", () => ({
  getAllCustomerIds: vi.fn(),
  getCustomerById: vi.fn(),
  getAllCustomers: vi.fn(),
  deleteCustomerById: vi.fn(),
}));

describe("fetchCustomerIds", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it("should fetch customer ids and pass them to callback as arg", async () => {
    const mockIds = ["1", "2"];
    (getAllCustomerIds as Mock).mockResolvedValue(mockIds);
    const mockCallback = vi.fn();
    await fetchCustomerIds(mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(mockIds);
  });
  it("should catch thrown error and show it", async () => {
    const error = new Error("Test error");
    (getAllCustomerIds as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    const mockCallback = vi.fn();
    await fetchCustomerIds(mockCallback);
    expect(getAllCustomerIds).toHaveBeenCalled();
    expect(mockCallback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching customer IDs: ",
      error
    );
  });
});
describe("setCustomerFormValues", () => {
  const formik = {
    setValues: vi.fn(),
  } as unknown as FormikProps<CustomerFormValues>;
  const selectedCustomerId = "1";
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it("should get customer data and set data to form", async () => {
    const selectedCustomer = {
      id: "1",
      name: "Customer 1",
    };
    (getCustomerById as Mock).mockResolvedValue(selectedCustomer);
    await setCustomerFormValues(formik, selectedCustomerId);
    expect(getCustomerById).toHaveBeenCalledWith(selectedCustomerId);
    expect(formik.setValues).toHaveBeenCalled();
  });
  it("should manage thrown error correctly", async () => {
    const error = new Error("Test error");
    (getCustomerById as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    await setCustomerFormValues(formik, selectedCustomerId);
    expect(getCustomerById).toHaveBeenCalledWith(selectedCustomerId);
    expect(formik.setValues).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error setting customer form values: ",
      error
    );
  });
});
describe("fetchCustomer", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.resetAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });
  const selectedCustomerId = "1";
  const callback = vi.fn();

  it("should get customer data and pass it to callback as arg", async () => {
    const result = { id: "1", name: "Customer 1" };
    (getCustomerById as Mock).mockResolvedValue(result);
    await fetchCustomer(selectedCustomerId, callback);
    expect(getCustomerById).toHaveBeenCalledWith(selectedCustomerId);
    expect(callback).toHaveBeenCalledWith(result);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
  it("should manage thrown error correctly", async () => {
    const error = new Error("Test error");
    (getCustomerById as Mock).mockRejectedValue(error);
    await fetchCustomer(selectedCustomerId, callback);
    expect(getCustomerById).toHaveBeenCalledWith(selectedCustomerId);
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching customer: ",
      error
    );
  });
});
describe("fetchAllCustomers", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.resetAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });
  const callback = vi.fn();
  it("should get all customers and pass them to callback as arg", async () => {
    const customers = [{ id: "1" }, { id: "2" }];
    (getAllCustomers as Mock).mockResolvedValue(customers);
    await fetchAllCustomers(callback);
    expect(getAllCustomers).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(customers);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
  it("should manage thrown error correctly", async () => {
    const error = new Error("Test error");
    (getAllCustomers as Mock).mockRejectedValue(error);
    await fetchAllCustomers(callback);
    expect(getAllCustomers).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching customers: ",
      error
    );
  });
});
describe("handleDeleteCustomer", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.resetAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });
  const selectedCustomerId = "1";
  const setSelectedCustomerId = vi.fn();
  it("should call delete customer by provided id and restore customer id", async () => {
    await handleDeleteCustomer(selectedCustomerId, setSelectedCustomerId);
    expect(deleteCustomerById).toHaveBeenCalled();
    expect(setSelectedCustomerId).toHaveBeenCalledWith("");
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
  it("should manage thrown error correctly", async () => {
    const error = new Error("Test error");
    (deleteCustomerById as Mock).mockRejectedValue(error);
    await handleDeleteCustomer(selectedCustomerId, setSelectedCustomerId);
    expect(deleteCustomerById).toHaveBeenCalled();
    expect(setSelectedCustomerId).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error deleting customer: ",
      error
    );
  });
});
