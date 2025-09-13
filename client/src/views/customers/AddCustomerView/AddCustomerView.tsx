import { useEffect, useState } from "react";
import CustomerForm from "../../../components/customers/CustomerForm/CustomerForm";
import { handleCreateCustomer } from "../../../services/customers/repository/customersRepository";
import { useAppStore } from "../../../stores/app-store";

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
    <>
      {isRenderDone && (
        <div className="w-full max-w-[700px]">
          <CustomerForm
            titleText="NEW CUSTOMER"
            submitButtonText="CREATE"
            onSubmit={handleCreateCustomer}
          />
        </div>
      )}
    </>
  );
};
