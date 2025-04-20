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
        <div className="flex flex-col items-center justify-center bg-ds-white p-ds-20 rounded shadow-ds-2 h-fit w-ds-384">
          <h1 className="text-2xl font-bold mb-ds-16">Select Project</h1>
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
          <button type="submit" className="form-button mt-ds-20">
            <p className="text-xl">{buttonText}</p>
          </button>
        </div>
      </div>
    </SharedForm>
  );
};

export default SelectProjectForm;
