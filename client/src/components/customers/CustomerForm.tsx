import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import SharedForm from "../formik/SharedForm";
import { customerFormValidationSchema } from "../../schemas";
import { CustomInput } from "../formik/CustomInput";
import { FormikHelpers } from "formik";

type CustomerFormValues = {
  address: string;
  company: string;
  email: string;
  name: string;
  phone: string;
  project: string;
};

const CustomerForm = () => {
  const initialValues: CustomerFormValues = {
    address: "",
    company: "",
    email: "",
    name: "",
    phone: "",
    project: "",
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await addDoc(collection(db, "customers"), {
  //       ...formData,
  //       createdAt: new Date().toISOString(),
  //     });
  //     alert("Customer created successfully!");
  //     setFormData(initialFormState);
  //   } catch (error) {
  //     console.error("Error creating customer: ", error);
  //     alert("Error creating customer!");
  //   }
  // };

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
    >
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">New Customer</h1>
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
          Create Customer
        </button>
      </div>
    </SharedForm>
  );
};

export default CustomerForm;
