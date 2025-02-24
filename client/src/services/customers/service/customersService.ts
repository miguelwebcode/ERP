import { FormikProps } from "formik";
import { Customer } from "../../../types";
import { CustomerFormValues } from "../../../types/form-values-types";
import {
  getAllCustomerIds,
  getCustomerById,
  getAllCustomers,
  deleteCustomerById,
} from "../repository/customersRepository";

export const fetchCustomerIds = async (callback: (ids: string[]) => void) => {
  try {
    const ids: string[] = (await getAllCustomerIds()) || [];
    callback(ids);
  } catch (error) {
    console.error("Error fetching customer IDs: ", error);
  }
};

export const setCustomerFormValues = async (
  formik: FormikProps<CustomerFormValues>,
  selectedCustomerId: string
) => {
  try {
    const selectedCustomer = (await getCustomerById(
      selectedCustomerId
    )) as Customer;
    if (selectedCustomer) {
      const newValues: CustomerFormValues = {
        address: selectedCustomer.address,
        company: selectedCustomer.company,
        email: selectedCustomer.email,
        name: selectedCustomer.name,
        phone: selectedCustomer.phone,
        project: selectedCustomer.project,
      };
      formik.setValues(newValues);
    }
  } catch (error) {
    console.error("Error setting customer form values: ", error);
  }
};

export const fetchCustomer = async (
  selectedCustomerId: string,
  callback: (value: React.SetStateAction<Customer>) => void
) => {
  try {
    const result = await getCustomerById(selectedCustomerId);
    callback(result as Customer);
  } catch (error) {
    console.error("Error fetching customer: ", error);
  }
};

export const fetchAllCustomers = async (
  callback: (value: React.SetStateAction<Customer[]>) => void
) => {
  try {
    const result = await getAllCustomers();
    callback(result as Customer[]);
  } catch (error) {
    console.error("Error fetching customers: ", error);
  }
};

export const handleDeleteCustomer = async (
  selectedCustomerId: string,
  setSelectedCustomerId: (selectedCustomerId: string) => void
) => {
  try {
    await deleteCustomerById(selectedCustomerId);
    setSelectedCustomerId("");
  } catch (error) {
    console.error("Error deleting customer: ", error);
  }
};
