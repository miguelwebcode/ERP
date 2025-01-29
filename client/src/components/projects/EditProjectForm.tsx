import { useEffect, useState } from "react";
import { useAppStore } from "../../stores/app-store";
import { EditProjectFormValues } from "../../types/form-values-types";
import { getAllProjectIds } from "../../services/projects";
import { FormikHelpers } from "formik";
import { editProjectFormValidationSchema } from "../../schemas";
import { CustomSelect } from "../formik/CustomSelect";
import SharedForm from "../formik/SharedForm";

export const EditProjectForm = () => {
  const [projectIds, setProjectIds] = useState<string[]>([]);

  const setSelectedProjectId = useAppStore(
    (state) => state.setSelectedProjectId
  );

  const initialValues: EditProjectFormValues = {
    projectId: "",
  };

  useEffect(() => {
    const fetchProjectIds = async () => {
      try {
        const ids: string[] = (await getAllProjectIds()) || [];
        setProjectIds(ids);
      } catch (error) {
        console.error("Error fetching project IDs: ", error);
      }
    };

    fetchProjectIds();
  }, []);

  const handleSubmit = async (
    values: EditProjectFormValues,
    formikHelpers: FormikHelpers<EditProjectFormValues>
  ) => {
    try {
      setSelectedProjectId(values.projectId);
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error getting customer: ", error);
      alert("Error getting customer!");
    }
  };

  return (
    <SharedForm<EditProjectFormValues>
      initialValues={initialValues}
      validationSchema={editProjectFormValidationSchema}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col md:flex-row justify-between px-5">
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-96 h-fit">
          <h1 className="text-2xl font-bold mb-4">Select Project</h1>
          <div className="w-4/5">
            <CustomSelect label="Project ID" name="projectId">
              <option value="" className="text-center">
                -- Select project ID --
              </option>
              {projectIds.map((id, index) => (
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
            FETCH PROJECT
          </button>
        </div>
      </div>
    </SharedForm>
  );
};
