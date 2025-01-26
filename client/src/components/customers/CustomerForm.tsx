import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import SharedForm from "../formik/SharedForm";
import { customerFormValidationSchema } from "../../schemas";
import { CustomInput } from "../formik/CustomInput";
import { FormikHelpers, FormikProps } from "formik";
import { CustomerFormValues } from "../../types/form-values-types";
import { useRef, useEffect } from "react";
import { getCustomerById } from "../../services/customers";
import { useAppStore } from "../../stores/app-store";

type CustomerFormProps = {
  titleText: string;
  submitButtonText: string;
  onSubmit: (
    values: CustomerFormValues,
    formikHelpers: FormikHelpers<CustomerFormValues>
  ) => void;
};

const CustomerForm = ({
  titleText,
  submitButtonText,
  onSubmit: handleSubmit,
}: CustomerFormProps) => {
  const formikRef = useRef<FormikProps<CustomerFormValues>>(null);
  const initialValues: CustomerFormValues = {
    address: "",
    company: "",
    email: "",
    name: "",
    phone: "",
    project: "",
  };

  const handleSubmit = async (
    values: CustomerFormValues,
    formikHelpers: FormikHelpers<CustomerFormValues>
  ) => {
    try {
      await addDoc(collection(db, "customers"), {
        ...values,
        createdAt: new Date().toISOString(),
      });
      /* 
       TODO: Show notification
      */
      alert("Customer created successfully!");
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error creating customer: ", error);
      alert("Error creating customer!");
    }
  };

  return (
    <SharedForm<CustomerFormValues>
      initialValues={initialValues}
      validationSchema={customerFormValidationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">{titleText}</h1>
        <div className="w-4/5">
          <CustomInput
            type="text"
            label="Address"
            name="address"
            placeholder="Enter customer's address"
          />
          <CustomInput
            type="text"
            label="Company"
            name="company"
            placeholder="Enter customer's company"
          />
          <CustomInput
            type="text"
            label="Email"
            name="email"
            placeholder="Enter customer's email"
          />
          <CustomInput
            type="text"
            label="Name"
            name="name"
            placeholder="Enter customer's name"
          />
          <CustomInput
            type="text"
            label="Phone"
            name="phone"
            placeholder="Enter customer's phone"
          />
          <CustomInput
            type="text"
            label="Project"
            name="project"
            placeholder="Enter customer's project"
          />
        </div>
        <button
          type="submit"
          className="w-4/5 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {submitButtonText}
        </button>
      </div>
    </SharedForm>
  );
};

export default CustomerForm;
