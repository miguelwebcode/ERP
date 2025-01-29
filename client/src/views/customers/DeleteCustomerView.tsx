import { useEffect, useRef, useState } from "react";
import DeleteCustomerForm from "../../components/customers/DeleteCustomerForm";
import { useAppStore } from "../../stores/app-store";
import { Customer } from "../../types";
import { deleteCustomerById, getCustomerById } from "../../services/customers";
import { SharedButton } from "../../components/ui/SharedButton";
import { CustomerCard } from "../../components/customers/CustomerCard";
import { SharedCard } from "../../components/ui/SharedCard";

export const DeleteCustomerView = () => {
  const selectedCustomerId = useAppStore((state) => state.selectedCustomerId);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(
    {} as Customer
  );

  const setSelectedCustomerId = useAppStore(
    (state) => state.setSelectedCustomerId
  );

  const fetchCustomer = async () => {
    const result = await getCustomerById(selectedCustomerId);
    setSelectedCustomer(result as Customer);
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      setSelectedCustomerId("");
      isFirstRender.current = false;
    }
    if (selectedCustomerId) {
      fetchCustomer();
    }
  }, [selectedCustomerId]);

  return (
    <div className="flex flex-col md:flex-row justify-center px-5">
      <>
        <DeleteCustomerForm />
        {selectedCustomerId && (
          <SharedCard>
            <CustomerCard customer={selectedCustomer} />
            <SharedButton
              text="DELETE Customer"
              handleClick={async () => {
                await deleteCustomerById(selectedCustomerId);
                setSelectedCustomerId("");
              }}
            />
          </SharedCard>
        )}
      </>
    </div>
  );
};
