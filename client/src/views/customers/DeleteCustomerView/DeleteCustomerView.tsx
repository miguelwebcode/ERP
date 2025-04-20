import { useEffect, useRef, useState } from "react";
import SelectCustomerForm from "../../../components/customers/SelectCustomerForm/SelectCustomerForm";
import { useAppStore } from "../../../stores/app-store";
import { Customer } from "../../../types";
import { CustomerCard } from "../../../components/customers/CustomerCard/CustomerCard";
import { SharedCard } from "../../../components/ui/SharedCard/SharedCard";
import { SelectCustomerFormValues } from "../../../types/form-values-types";
import { FormikHelpers } from "formik";
import {
  fetchAllCustomers,
  fetchCustomer,
  handleDeleteCustomer,
} from "../../../services/customers/service/customersService";
import { NoCustomersFoundMessage } from "../../../components/customers/NoCustomersFoundMessage/NoCustomersFoundMessage";

export const DeleteCustomerView = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const selectedCustomerId = useAppStore((state) => state.selectedCustomerId);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(
    {} as Customer
  );

  const setSelectedCustomerId = useAppStore(
    (state) => state.setSelectedCustomerId
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      setSelectedCustomerId("");
      fetchAllCustomers(setCustomers);

      isFirstRender.current = false;
    }
    if (selectedCustomerId) {
      fetchCustomer(selectedCustomerId, setSelectedCustomer);
    }
  }, [selectedCustomerId]);

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
          <SelectCustomerForm
            buttonText="FETCH CUSTOMER"
            onSubmit={handleSubmit}
          />
          {selectedCustomerId && (
            <SharedCard>
              <CustomerCard customer={selectedCustomer} />
              <div className="flex justify-center mb-6 mx-5">
                <button
                  className="form-button"
                  onClick={async () => {
                    await handleDeleteCustomer(
                      selectedCustomerId,
                      setSelectedCustomerId
                    );
                  }}
                >
                  <p className="text-xl">DELETE</p>
                </button>
              </div>
            </SharedCard>
          )}
        </div>
      ) : (
        <NoCustomersFoundMessage />
      )}
    </>
  );
};
