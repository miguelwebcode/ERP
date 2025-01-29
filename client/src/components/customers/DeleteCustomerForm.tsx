import { useState, useEffect } from "react";
import { FormikHelpers } from "formik";
import { deleteCustomerFormValidationSchema } from "../../schemas";
import { CustomSelect } from "../formik/CustomSelect";
import SharedForm from "../formik/SharedForm";
import { getAllCustomerIds } from "../../services/customers";
import { DeleteCustomerFormValues } from "../../types/form-values-types";
import { useAppStore } from "../../stores/app-store";

const DeleteCustomerForm = () => {
  const [customerIds, setCustomerIds] = useState<string[]>([]);

  const setSelectedCustomerId = useAppStore(
    (state) => state.setSelectedCustomerId
  );
  const selectedCustomerId = useAppStore((state) => state.selectedCustomerId);

  const initialValues: DeleteCustomerFormValues = {
    customerId: "",
  };

  const fetchCustomerIds = async () => {
    try {
      const ids: string[] = (await getAllCustomerIds()) || [];
      setCustomerIds(ids);
    } catch (error) {
      console.error("Error fetching customer IDs: ", error);
    }
  };

  useEffect(() => {
    fetchCustomerIds();
  }, [selectedCustomerId]);

  const handleSubmit = async (
    values: DeleteCustomerFormValues,
    formikHelpers: FormikHelpers<DeleteCustomerFormValues>
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
    <SharedForm<DeleteCustomerFormValues>
      initialValues={initialValues}
      validationSchema={deleteCustomerFormValidationSchema}
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
            FETCH CUSTOMER
          </button>
        </div>
      </div>
    </SharedForm>
  );
};

export default DeleteCustomerForm;
