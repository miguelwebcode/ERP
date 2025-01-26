import { useState, useEffect } from "react";
import { FormikHelpers } from "formik";
import { editCustomerFormValidationSchema } from "../../schemas";
import { CustomSelect } from "../formik/CustomSelect";
import SharedForm from "../formik/SharedForm";
import { getAllCustomerIds } from "../../services/customers";
import { useAppStore } from "../../stores/app-store";
import { EditCustomerFormValues } from "../../types/form-values-types";

const EditCustomerForm = () => {
  const [customerIds, setCustomerIds] = useState<string[]>([]);
  const setIsEditingCustomer = useAppStore(
    (state) => state.setIsEditingCustomer
  );
  const setSelectedCustomerId = useAppStore(
    (state) => state.setSelectedCustomerId
  );

  const initialValues: EditCustomerFormValues = {
    customerId: "",
  };

  useEffect(() => {
    const fetchCustomerIds = async () => {
      try {
        // Ensure that the ids variable is always assigned an array,
        // even if getAllCustomerIds returns undefined
        const ids: string[] = (await getAllCustomerIds()) || [];
        setCustomerIds(ids);
      } catch (error) {
        console.error("Error fetching customer IDs: ", error);
      }
    };

    fetchCustomerIds();
  }, []);

  const handleSubmit = async (
    values: EditCustomerFormValues,
    formikHelpers: FormikHelpers<EditCustomerFormValues>
  ) => {
    try {
      setSelectedCustomerId(values.customerId);
      setIsEditingCustomer(true);
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error getting customer: ", error);
      alert("Error getting customer!");
    }
  };

  return (
    <SharedForm<EditCustomerFormValues>
      initialValues={initialValues}
      validationSchema={editCustomerFormValidationSchema}
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
            className="w-4/5 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            EDIT
          </button>
        </div>
      </div>
    </SharedForm>
  );
};

export default EditCustomerForm;
