import { useEffect, useState } from "react";
import CustomerForm from "../components/customers/CustomerForm";
import { handleCreateCustomer } from "../services/customers";
import { useAppStore } from "../stores/app-store";

export const AddCustomerView = () => {
  const [isRenderDone, setIsRenderDone] = useState(false);

  const setSelectedCustomerId = useAppStore(
    (state) => state.setSelectedCustomerId
  );

  useEffect(() => {
    setSelectedCustomerId("");
    setIsRenderDone(true);
  });
  return (
    /* 
     TODO: On render, 
     isEditingCustomer = false
     selectedCustomerId = ""
    */

    <div className="flex justify-center">
      {isRenderDone && (
        <CustomerForm
          titleText="NEW CUSTOMER"
          submitButtonText="CREATE CUSTOMER"
          onSubmit={handleCreateCustomer}
        />
      )}
    </div>
  );
};
