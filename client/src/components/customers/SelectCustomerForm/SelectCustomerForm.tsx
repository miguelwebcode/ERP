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
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col items-center justify-center bg-ds-white p-ds-20 rounded-ds-sm shadow-ds-2 h-fit w-ds-384">
          <h1 className="text-ds-xl font-bold mb-ds-16">Select Customer</h1>
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
          <button type="submit" className="form-button">
            <p className="text-ds-lg">{buttonText}</p>
          </button>
        </div>
      </div>
    </SharedForm>
  );
};

export default SelectCustomerForm;
