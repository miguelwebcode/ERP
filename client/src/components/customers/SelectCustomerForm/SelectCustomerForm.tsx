import { useState, useEffect } from "react";
import { FormikHelpers } from "formik";
import { selectCustomerFormValidationSchema } from "../../../schemas";
import { CustomSelect } from "../../formik/CustomSelect/CustomSelect";
import SharedForm from "../../formik/SharedForm/SharedForm";
import { fetchAllCustomers } from "../../../services/customers/service/customersService";
import { SelectCustomerFormValues } from "../../../types/form-values-types";
import { useAppStore } from "../../../stores/app-store";
import { Customer } from "@/types";

type SelectCustomerForm = {
  buttonText: string;
  onSubmit: (
    values: SelectCustomerFormValues,
    formikHelpers: FormikHelpers<SelectCustomerFormValues>
  ) => Promise<void>;
};

const SelectCustomerForm = ({
  buttonText,
  onSubmit: handleSubmit,
}: SelectCustomerForm) => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const selectedCustomerId = useAppStore((state) => state.selectedCustomerId);

  const initialValues: SelectCustomerFormValues = {
    customerId: "",
  };

  useEffect(() => {
    fetchAllCustomers(setCustomers);
  }, [selectedCustomerId]);

  return (
    <SharedForm<SelectCustomerFormValues>
      initialValues={initialValues}
      validationSchema={selectCustomerFormValidationSchema}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col items-center justify-center bg-ds-white p-5 rounded shadow-ds-2 h-fit w-96">
          <h1 className="text-2xl font-bold mb-4">Select Customer</h1>
          <CustomSelect label="Customer ID" name="customerId">
            <option value="" className="text-center">
              -- Select customer ID --
            </option>
            {customers.map((customer, index) => (
              <option key={index} value={customer.id}>
                {`${customer.name}: ${customer.id}`}
              </option>
            ))}
          </CustomSelect>
          <button type="submit" className="form-button mt-5">
            <p className="text-xl">{buttonText}</p>
          </button>
        </div>
      </div>
    </SharedForm>
  );
};

export default SelectCustomerForm;
