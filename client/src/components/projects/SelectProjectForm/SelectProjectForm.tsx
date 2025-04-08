import { FormikHelpers } from "formik";
import { useState, useEffect } from "react";
import { selectProjectFormValidationSchema } from "../../../schemas";
import { fetchProjectIds } from "../../../services/projects/service/projectsService";
import { SelectProjectFormValues } from "../../../types/form-values-types";
import { CustomSelect } from "../../formik/CustomSelect/CustomSelect";
import SharedForm from "../../formik/SharedForm/SharedForm";
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
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col items-center justify-center bg-ds-white p-ds-20 rounded-ds-sm shadow-ds-2 h-fit">
          <h1 className="text-ds-xl font-bold mb-ds-16">Select Project</h1>
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
          <button
            type="submit"
            className="w-full bg-ds-primary-500 text-ds-white font-bold py-ds-8 px-ds-16 mt-ds-20 rounded-ds-sm hover:bg-ds-primary-600"
          >
            <p className="text-ds-lg">{buttonText}</p>
          </button>
        </div>
      </div>
    </SharedForm>
  );
};

export default SelectProjectForm;
