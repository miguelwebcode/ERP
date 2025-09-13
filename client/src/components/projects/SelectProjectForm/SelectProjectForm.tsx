import { FormikHelpers } from "formik";
import { useState, useEffect } from "react";
import { selectProjectFormValidationSchema } from "../../../schemas";
import { fetchAllProjects } from "../../../services/projects/service/projectsService";
import { SelectProjectFormValues } from "../../../types/form-values-types";
import { CustomSelect } from "../../formik/CustomSelect/CustomSelect";
import SharedForm from "../../formik/SharedForm/SharedForm";
import { useAppStore } from "../../../stores/app-store";
import { Project } from "@/types";

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
  const [projects, setProjects] = useState<Project[]>([]);
  const selectedProjectId = useAppStore((state) => state.selectedProjectId);

  const initialValues: SelectProjectFormValues = {
    projectId: "",
  };

  useEffect(() => {
    fetchAllProjects(setProjects);
  }, [selectedProjectId]);

  return (
    <SharedForm<SelectProjectFormValues>
      initialValues={initialValues}
      validationSchema={selectProjectFormValidationSchema}
      onSubmit={handleSubmit}
    >
      <div className="w-full max-w-md px-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Select Project</h1>
        <CustomSelect label="Project ID" name="projectId">
          <option value="" className="text-center">
            -- Select project ID --
          </option>
          {projects.map((project, index) => (
            <option key={index} value={project.id} className="truncate">
              {`${project.name}: ${project.id}`}
            </option>
          ))}
        </CustomSelect>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white mt-6 py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
        >
          <p className="text-xl">{buttonText}</p>
        </button>
      </div>
    </SharedForm>
  );
};

export default SelectProjectForm;
