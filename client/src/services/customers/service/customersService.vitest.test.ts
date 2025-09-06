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
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let callback: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    callback = vi.fn((_ids: string[]) => void 0);
  });

  it("should get ids and pass ids as arg", async () => {
    const ids = ["1", "2", "3"];
    (getAllCustomerIds as Mock).mockReturnValue(ids);
    const result = await fetchCustomerIds(callback);
    expect(getAllCustomerIds).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(ids);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
  
  it("should manage errors correctly", async () => {
    const error = new Error("error message");
    (getAllCustomerIds as Mock).mockRejectedValue(error);
    const result = await fetchCustomerIds(callback);
    expect(getAllCustomerIds).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching customer IDs: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
describe("setCustomerFormValues", () => {
  const formik = {
    setValues: vi.fn((_newValues: CustomerFormValues) => void 0),
  } as unknown as FormikProps<CustomerFormValues>;
  const selectedCustomerId = "1";

  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should set form values", async () => {
    const selectedCustomer = {
      id: "1",
      name: "Customer 1",
      address: "street 123",
      company: "Company A",
      email: "customer@email.com",
      phone: "111111111",
    };
    (getCustomerById as Mock).mockReturnValue(selectedCustomer);

    const { id, ...formValues } = selectedCustomer;
    const newValues: CustomerFormValues = formValues;

    const result = await setCustomerFormValues(formik, selectedCustomerId);
    expect(getCustomerById).toHaveBeenCalledWith(selectedCustomerId);
    expect(formik.setValues).toHaveBeenCalledWith(newValues);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("test error");
    (getCustomerById as Mock).mockRejectedValue(error);
    const result = await setCustomerFormValues(formik, selectedCustomerId);
    expect(getCustomerById).toHaveBeenCalledWith(selectedCustomerId);
    expect(formik.setValues).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error setting customer form values: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
describe("fetchCustomer", () => {
  const selectedCustomerId = "1";
  let callback: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    callback = vi.fn((_value: React.SetStateAction<any>) => void 0);
  });

  it("should fetch customer data", async () => {
    const customer = {
      id: "1",
      name: "Customer 1",
      address: "street 123",
      company: "Company A",
      email: "customer@email.com",
      phone: "111111111",
    };
    (getCustomerById as Mock).mockReturnValue(customer);
    const result = await fetchCustomer(selectedCustomerId, callback);
    expect(getCustomerById).toHaveBeenCalledWith(selectedCustomerId);
    expect(callback).toHaveBeenCalledWith(customer);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("error msg");
    (getCustomerById as Mock).mockRejectedValue(error);
    const result = await fetchCustomer(selectedCustomerId, callback);
    expect(getCustomerById).toHaveBeenCalledWith(selectedCustomerId);
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching customer: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
describe("fetchAllCustomers", () => {
  let callback: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    callback = vi.fn((_value: React.SetStateAction<any[]>) => void 0);
  });

  it("should fetch all customers", async () => {
    const customers = [
      {
        id: "1",
        name: "Customer 1",
        address: "street 123",
        company: "Company A",
        email: "customer1@email.com",
        phone: "111111111",
      },
      {
        id: "2",
        name: "Customer 2",
        address: "street 456",
        company: "Company B",
        email: "customer2@email.com",
        phone: "222222222",
      },
    ];
    (getAllCustomers as Mock).mockReturnValue(customers);
    const result = await fetchAllCustomers(callback);
    expect(getAllCustomers).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(customers);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("Test msg");
    (getAllCustomers as Mock).mockRejectedValue(error);
    const result = await fetchAllCustomers(callback);
    expect(getAllCustomers).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching customers: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
describe("handleDeleteCustomer", () => {
  const selectedCustomerId = "1";
  let setSelectedCustomerId: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    setSelectedCustomerId = vi.fn((_selectedCustomerId) => void 0);
  });

  it("should deleteCustomerById and setSelectedCustomerId to empty string", async () => {
    const result = await handleDeleteCustomer(
      selectedCustomerId,
      setSelectedCustomerId
    );
    expect(deleteCustomerById).toHaveBeenCalledWith(selectedCustomerId);
    expect(setSelectedCustomerId).toHaveBeenCalledWith("");
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should manage errors correctly", async () => {
    const error = new Error("error msg");
    (deleteCustomerById as Mock).mockRejectedValue(error);
    const result = await handleDeleteCustomer(
      selectedCustomerId,
      setSelectedCustomerId
    );
    expect(deleteCustomerById).toHaveBeenCalledWith(selectedCustomerId);
    expect(setSelectedCustomerId).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error deleting customer: ",
      error
    );
    expect(result).toBeUndefined();
  });
});
