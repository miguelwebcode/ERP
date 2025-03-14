import { useState, useEffect } from "react";
import { FormikHelpers } from "formik";
import { selectCustomerFormValidationSchema } from "../../../schemas";
import { CustomSelect } from "../../formik/CustomSelect/CustomSelect";
import SharedForm from "../../formik/SharedForm/SharedForm";
import { fetchCustomerIds } from "../../../services/customers/service/customersService";
import { SelectCustomerFormValues } from "../../../types/form-values-types";
import { useAppStore } from "../../../stores/app-store";

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
  const [customerIds, setCustomerIds] = useState<string[]>([]);

  const selectedCustomerId = useAppStore((state) => state.selectedCustomerId);

  const initialValues: SelectCustomerFormValues = {
    customerId: "",
  };

  useEffect(() => {
    fetchCustomerIds(setCustomerIds);
  }, [selectedCustomerId]);

  return (
    <SharedForm<SelectCustomerFormValues>
      initialValues={initialValues}
      validationSchema={selectCustomerFormValidationSchema}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col md:flex-row justify-between px-5">
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-96 h-fit">
          <h1 className="text-2xl font-bold mb-4">Select Customer</h1>
          <div className="w-4/5">
            <CustomSelect label="Customer ID" name="customerId">
              <option value="" className="text-center">
                -- Select customer ID --
              </option>
              {customerIds.map((id, index) => (
                <option key={index} value={id}>
                  {id}
                </option>
              ))}
            </CustomSelect>
          </div>
          <button
            type="submit"
            className="w-4/5 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </SharedForm>
  );
};

export default SelectCustomerForm;
