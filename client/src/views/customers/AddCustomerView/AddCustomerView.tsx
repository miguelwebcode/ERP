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
    <div className="flex flex-col justify-center gap-10">
      <h1 className="uppercase font-bold text-3xl text-center">Add Customer</h1>

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
