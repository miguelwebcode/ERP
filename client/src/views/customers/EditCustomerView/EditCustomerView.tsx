import { FormikHelpers } from "formik";
import CustomerForm from "../../../components/customers/CustomerForm/CustomerForm";
import { handleEditCustomer } from "../../../services/customers/repository/customersRepository";
import { useAppStore } from "../../../stores/app-store";
import {
  CustomerFormValues,
  SelectCustomerFormValues,
} from "../../../types/form-values-types";
import { useState, useEffect } from "react";
import SelectCustomerForm from "../../../components/customers/SelectCustomerForm/SelectCustomerForm";
import { Customer } from "../../../types";
import { fetchAllCustomers } from "../../../services/customers/service/customersService";
import { NoCustomersFoundMessage } from "../../../components/customers/NoCustomersFoundMessage/NoCustomersFoundMessage";

export const EditCustomerView = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedCustomerId = useAppStore((state) => state.selectedCustomerId);

  const setSelectedCustomerId = useAppStore(
    (state) => state.setSelectedCustomerId
  );

  useEffect(() => {
    fetchAllCustomers((fetchedCustomers) => {
      setCustomers(fetchedCustomers);
      setIsLoading(false);
    });
    // Set again so CustomerForm has correct value
    selectedCustomerId && setSelectedCustomerId(selectedCustomerId);

    return () => {
      setSelectedCustomerId("");
    };
  }, []);

  if (isLoading) {
    return null;
  }

  const handleSubmit = async (
    values: SelectCustomerFormValues,
    formikHelpers: FormikHelpers<SelectCustomerFormValues>
  ) => {
    try {
      setSelectedCustomerId(values.customerId);
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error getting customer: ", error);
      alert("Error getting customer!");
    }
  };
  return (
    <>
      {customers.length ? (
        <div className="flex flex-col gap-8 justify-center px-5">
          <SelectCustomerForm buttonText="GET DATA" onSubmit={handleSubmit} />
          <CustomerForm
            titleText="EDIT CUSTOMER"
            submitButtonText="UPDATE"
            canBeDisabled={selectedCustomerId === ""}
            onSubmit={async (
              values: CustomerFormValues,
              formikHelpers: FormikHelpers<CustomerFormValues>
            ) => {
              await handleEditCustomer(
                selectedCustomerId,
                values,
                formikHelpers
              );
              setSelectedCustomerId("");
            }}
          />
        </div>
      ) : (
        <NoCustomersFoundMessage />
      )}
    </>
  );
};

export default EditCustomerView;
