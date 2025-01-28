import { FormikHelpers } from "formik";
import CustomerForm from "../components/customers/CustomerForm";
import EditCustomerForm from "../components/customers/EditCustomerForm";
import { handleEditCustomer } from "../services/customers";
import { useAppStore } from "../stores/app-store";
import { CustomerFormValues } from "../types/form-values-types";
import { useState, useEffect } from "react";

export const EditCustomerView = () => {
  /* 
  TODO: Show form always, form fields disabled until customer fetch is done
  When this view is render, inside useEffect:
  isEditingCustomer = false
  selectedCustomerID = ""
  
  When UPDATE is done, inside onSubmit:
  isEditingCustomer = false
  selectedCustomerID = ""
  
  
  */

  const [isRenderDone, setIsRenderDone] = useState(false);
  const selectedCustomerId = useAppStore((state) => state.selectedCustomerId);

  const setSelectedCustomerId = useAppStore(
    (state) => state.setSelectedCustomerId
  );

  useEffect(() => {
    setSelectedCustomerId("");
    setIsRenderDone(true);
  }, []);
  return (
    <div className="flex flex-col md:flex-row justify-center px-5">
      {isRenderDone && (
        <>
          <EditCustomerForm />
          <CustomerForm
            titleText="EDIT CUSTOMER"
            submitButtonText="UPDATE CUSTOMER"
            onSubmit={async (
              values: CustomerFormValues,
              formikHelpers: FormikHelpers<CustomerFormValues>
            ) => {
              await handleEditCustomer(
                selectedCustomerId,
                values,
                formikHelpers
              );
              setSelectedCustomerId("");
            }}
          />
        </>
      )}
    </div>
  );
};

export default EditCustomerView;
