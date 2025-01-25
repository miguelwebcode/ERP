import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FormikHelpers } from "formik";
import SharedForm from "../formik/SharedForm";
import { projectFormValidationSchema } from "../../schemas";
import { CustomInput } from "../formik/CustomInput";
import { CustomSelect } from "../formik/CustomSelect";
import { projectStates } from "../../data";

type ProjectFormValues = {
  customerId: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  name: string;
  state: string;
  developer: string;
};

const ProjectForm = () => {
  const initialValues: ProjectFormValues = {
    customerId: "",
    description: "",
    startDate: null,
    endDate: null,
    name: "",
    state: "",
    developer: "",
  };

  const handleSubmit = async (
    values: ProjectFormValues,
    formikHelpers: FormikHelpers<ProjectFormValues>
  ) => {
    try {
      await addDoc(collection(db, "projects"), {
        ...values,
      });
      alert("Project created successfully!");
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error creating project: ", error);
      alert("Error creating project!");
    }
  };

  return (
    <SharedForm<ProjectFormValues>
      initialValues={initialValues}
      validationSchema={projectFormValidationSchema}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">New Project</h1>
        <div className="w-4/5">
          <CustomInput
            type="text"
            label="Name"
            name="name"
            placeholder="Enter project's name"
          />
          <CustomInput
            type="text"
            label="Description"
            name="description"
            placeholder="Enter project's description"
          />
          <CustomInput
            type="text"
            label="Customer ID"
            name="customerId"
            placeholder="Enter project's customer id"
          />
          <CustomInput
            type="date"
            label="Start Date"
            name="startDate"
            placeholder="Enter project's startDate"
          />
          <CustomInput
            type="date"
            label="End Date"
            name="endDate"
            placeholder="Enter project's endDate"
          />
          <CustomSelect label="Project State" name="state">
            <option className="text-center" value="">
              -- Select an option --
            </option>
            {projectStates.map((projectState) => {
              return (
                <option key={projectState.id} value={projectState.id}>
                  {projectState.value}
                </option>
              );
            })}
          </CustomSelect>
          <CustomInput
            type="text"
            label="Assigned Developer"
            name="developer"
            placeholder="Enter project's assigned developer"
          />
        </div>
        <button
          type="submit"
          className="w-4/5 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create Project
        </button>
      </div>
    </SharedForm>
  );
};

export default ProjectForm;
