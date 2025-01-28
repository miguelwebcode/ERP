import { FormikHelpers } from "formik";
import CustomerForm from "../components/customers/CustomerForm";
import EditCustomerForm from "../components/customers/EditCustomerForm";
import { handleEditCustomer } from "../services/customers";
import { useAppStore } from "../stores/app-store";
import { CustomerFormValues } from "../types/form-values-types";

export const EditCustomerView = () => {
  const isEditingCustomer = useAppStore((state) => state.isEditingCustomer);
  const selectedCustomerId = useAppStore((state) => state.selectedCustomerId);

  /* 
   TODO: Show form always, form fields disabled until customer fetch is done
  When this view is render, inside useEffect:
   isEditingCustomer = false
   selectedCustomerID = ""

   When UPDATE is done, inside onSubmit:
   isEditingCustomer = false
   selectedCustomerID = ""

   
  */
  return (
    <div className="flex flex-col md:flex-row justify-center px-5">
      <EditCustomerForm />
      {isEditingCustomer && (
        <CustomerForm
          titleText="EDIT CUSTOMER"
          submitButtonText="UPDATE CUSTOMER"
          onSubmit={(
            values: CustomerFormValues,
            formikHelpers: FormikHelpers<CustomerFormValues>
          ) => {
            handleEditCustomer(selectedCustomerId, values, formikHelpers);
          }}
        />
      )}
    </div>
  );
};

export default EditCustomerView;
