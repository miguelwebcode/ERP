import CustomerForm from "../components/customers/CustomerForm";
import EditCustomerForm from "../components/customers/EditCustomerForm";
import { handleCreateCustomer } from "../services/customers";
import { useAppStore } from "../stores/app-store";

export const EditCustomerView = () => {
  const isEditingCustomer = useAppStore((state) => state.isEditingCustomer);
  return (
    <div className="flex flex-col md:flex-row justify-center px-5">
      <EditCustomerForm />
      {isEditingCustomer && (
        <CustomerForm
          titleText="EDIT CUSTOMER"
          submitButtonText="UPDATE CUSTOMER"
          onSubmit={handleCreateCustomer}
        />
      )}
    </div>
  );
};

export default EditCustomerView;
