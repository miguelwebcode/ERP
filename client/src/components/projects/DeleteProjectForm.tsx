import { FormikHelpers } from "formik";
import { useState, useEffect } from "react";
import { deleteProjectFormValidationSchema } from "../../schemas";
import { getAllProjectIds } from "../../services/projects";
import { DeleteProjectFormValues } from "../../types/form-values-types";
import { CustomSelect } from "../formik/CustomSelect";
import SharedForm from "../formik/SharedForm";
import { useAppStore } from "../../stores/app-store";

const DeleteProjectForm = () => {
  const [projectIds, setProjectIds] = useState<string[]>([]);

  const setSelectedProjectId = useAppStore(
    (state) => state.setSelectedProjectId
  );
  const selectedProjectId = useAppStore((state) => state.selectedProjectId);

  const initialValues: DeleteProjectFormValues = {
    projectId: "",
  };

  const fetchProjectIds = async () => {
    try {
      const ids: string[] = (await getAllProjectIds()) || [];
      setProjectIds(ids);
    } catch (error) {
      console.error("Error fetching project IDs: ", error);
    }
  };

  useEffect(() => {
    fetchProjectIds();
  }, [selectedProjectId]);

  const handleSubmit = async (
    values: DeleteProjectFormValues,
    formikHelpers: FormikHelpers<DeleteProjectFormValues>
  ) => {
    try {
      setSelectedProjectId(values.projectId);
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error getting project: ", error);
      alert("Error getting project!");
    }
  };

  return (
    <SharedForm<DeleteProjectFormValues>
      initialValues={initialValues}
      validationSchema={deleteProjectFormValidationSchema}
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

export default DeleteProjectForm;
