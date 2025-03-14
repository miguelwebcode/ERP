import { useEffect, useRef, useState } from "react";
import SelectCustomerForm from "../../../components/customers/SelectCustomerForm/SelectCustomerForm";
import { useAppStore } from "../../../stores/app-store";
import { Customer } from "../../../types";
import { SharedButton } from "../../../components/ui/SharedButton/SharedButton";
import { CustomerCard } from "../../../components/customers/CustomerCard/CustomerCard";
import { SharedCard } from "../../../components/ui/SharedCard/SharedCard";
import { SelectCustomerFormValues } from "../../../types/form-values-types";
import { FormikHelpers } from "formik";
import {
  fetchCustomer,
  handleDeleteCustomer,
} from "../../../services/customers/service/customersService";

export const DeleteCustomerView = () => {
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
    <div className="flex flex-col md:flex-row justify-center px-5">
      <>
        <SelectCustomerForm
          buttonText="FETCH CUSTOMER"
          onSubmit={handleSubmit}
        />
        {selectedCustomerId && (
          <SharedCard>
            <CustomerCard customer={selectedCustomer} />
            <div className="flex justify-center">
              <SharedButton
                text="DELETE Customer"
                onClick={async () => {
                  await handleDeleteCustomer(
                    selectedCustomerId,
                    setSelectedCustomerId
                  );
                }}
              />
            </div>
          </SharedCard>
        )}
      </>
    </div>
  );
};
