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
      <div className="w-full max-w-md px-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Select Customer</h1>
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
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white mt-6 py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
        >
          <p className="text-xl">{buttonText}</p>
        </button>
      </div>
    </SharedForm>
  );
};

export default SelectCustomerForm;
