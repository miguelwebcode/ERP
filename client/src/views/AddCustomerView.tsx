import CustomerForm from "../components/customers/CustomerForm";
import { handleCreateCustomer } from "../services/customers";

export const AddCustomerView = () => {
  return (
    <div className="flex justify-center">
      <CustomerForm
        titleText="NEW CUSTOMER"
        submitButtonText="CREATE CUSTOMER"
        onSubmit={handleCreateCustomer}
      />
    </div>
  );
};
