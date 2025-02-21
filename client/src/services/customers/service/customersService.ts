import { FormikProps } from "formik";
import { Customer } from "../../../types";
import { CustomerFormValues } from "../../../types/form-values-types";
import {
  getAllCustomerIds,
  getCustomerById,
  getAllCustomers,
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
  const result = await getCustomerById(selectedCustomerId);
  callback(result as Customer);
};

export const fetchAllCustomers = async (
  callback: (value: React.SetStateAction<Customer[]>) => void
) => {
  const result = await getAllCustomers();
  callback(result as Customer[]);
};
