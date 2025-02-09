import { FormikHelpers } from "formik";
import { useState, useEffect } from "react";
import { selectProjectFormValidationSchema } from "../../../schemas";
import { fetchProjectIds } from "../../../services/projects";
import { SelectProjectFormValues } from "../../../types/form-values-types";
import { CustomSelect } from "../../formik/CustomSelect/CustomSelect";
import SharedForm from "../../formik/SharedForm";
import { useAppStore } from "../../../stores/app-store";

type SelectProjectFormProps = {
  buttonText: string;
  onSubmit: (
    values: SelectProjectFormValues,
    formikHelpers: FormikHelpers<SelectProjectFormValues>
  ) => Promise<void>;
};

const SelectProjectForm = ({
  buttonText,
  onSubmit: handleSubmit,
}: SelectProjectFormProps) => {
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const selectedProjectId = useAppStore((state) => state.selectedProjectId);

  const initialValues: SelectProjectFormValues = {
    projectId: "",
  };

  useEffect(() => {
    fetchProjectIds(setProjectIds);
  }, [selectedProjectId]);

  return (
    <SharedForm<SelectProjectFormValues>
      initialValues={initialValues}
      validationSchema={selectProjectFormValidationSchema}
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
            {buttonText}
          </button>
        </div>
      </div>
    </SharedForm>
  );
};

export default SelectProjectForm;
