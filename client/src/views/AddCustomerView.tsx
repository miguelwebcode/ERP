import CustomerForm from "../components/customers/CustomerForm";
import { handleCreateCustomer } from "../services/customers";

export const AddCustomerView = () => {
  return (
    /* 
     TODO: On render, 
     isEditingCustomer = false
     selectedCustomerId = ""
    */
    <div className="flex justify-center">
      <CustomerForm
        titleText="NEW CUSTOMER"
        submitButtonText="CREATE CUSTOMER"
        onSubmit={handleCreateCustomer}
      />
    </div>
  );
};
