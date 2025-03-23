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
      <h1 className="uppercase font-bold text-3xl text-center mb-10">
        Add Customer
      </h1>
      <div className="flex flex-col justify-center">
        {isRenderDone && (
          <CustomerForm
            titleText="NEW CUSTOMER"
            submitButtonText="CREATE CUSTOMER"
            onSubmit={handleCreateCustomer}
          />
        )}
      </div>
    </>
  );
};
