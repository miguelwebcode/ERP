import { FormikHelpers } from "formik";
import CustomerForm from "../../../components/customers/CustomerForm/CustomerForm";
import { handleEditCustomer } from "../../../services/customers/repository/customersRepository";
import { useAppStore } from "../../../stores/app-store";
import {
  CustomerFormValues,
  SelectCustomerFormValues,
} from "../../../types/form-values-types";
import { useState, useEffect } from "react";
import SelectCustomerForm from "../../../components/customers/SelectCustomerForm/SelectCustomerForm";

export const EditCustomerView = () => {
  const [isRenderDone, setIsRenderDone] = useState(false);
  const selectedCustomerId = useAppStore((state) => state.selectedCustomerId);

  const setSelectedCustomerId = useAppStore(
    (state) => state.setSelectedCustomerId
  );

  useEffect(() => {
    setSelectedCustomerId("");
    setIsRenderDone(true);
  }, []);

  const handleSubmit = async (
    values: SelectCustomerFormValues,
    formikHelpers: FormikHelpers<SelectCustomerFormValues>
  ) => {
    try {
      setSelectedCustomerId(values.customerId);
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error getting customer: ", error);
      alert("Error getting customer!");
    }
  };
  return (
    <>
      <h1 className="uppercase font-bold text-3xl text-center mb-10">
        Update Customer
      </h1>
      <div className="flex flex-col gap-2 lg:flex-row justify-center px-5">
        {isRenderDone && (
          <>
            <SelectCustomerForm
              buttonText="FETCH CUSTOMER"
              onSubmit={handleSubmit}
            />
            <CustomerForm
              titleText="EDIT CUSTOMER"
              submitButtonText="UPDATE CUSTOMER"
              canBeDisabled={true}
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
    </>
  );
};

export default EditCustomerView;
