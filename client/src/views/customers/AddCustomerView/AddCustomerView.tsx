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
        <CustomerForm
          titleText="NEW CUSTOMER"
          submitButtonText="CREATE"
          onSubmit={handleCreateCustomer}
        />
      )}
    </>
  );
};
