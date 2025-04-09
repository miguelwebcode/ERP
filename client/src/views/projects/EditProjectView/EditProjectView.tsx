import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/app-store";
import ProjectForm from "../../../components/projects/ProjectForm/ProjectForm";
import {
  ProjectFormValues,
  SelectProjectFormValues,
} from "../../../types/form-values-types";
import { FormikHelpers } from "formik";
import { handleEditProject } from "../../../services/projects/repository/projectsRepository";
import SelectProjectForm from "../../../components/projects/SelectProjectForm/SelectProjectForm";

export const EditProjectView = () => {
  const [isRenderDone, setIsRenderDone] = useState(false);
  const selectedProjectId = useAppStore((state) => state.selectedProjectId);

  const setSelectedProjectId = useAppStore(
    (state) => state.setSelectedProjectId
  );

  useEffect(() => {
    setSelectedProjectId("");
    setIsRenderDone(true);
  }, []);

  const handleSubmit = async (
    values: SelectProjectFormValues,
    formikHelpers: FormikHelpers<SelectProjectFormValues>
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
    <div className="flex flex-col gap-ds-32 justify-center px-ds-20">
      {isRenderDone && (
        <>
          <SelectProjectForm buttonText="GET DATA" onSubmit={handleSubmit} />
          <ProjectForm
            titleText="EDIT PROJECT"
            submitButtonText="UPDATE"
            canBeDisabled={true}
            onSubmit={async (
              values: ProjectFormValues,
              formikHelpers: FormikHelpers<ProjectFormValues>
            ) => {
              await handleEditProject(selectedProjectId, values, formikHelpers);
              setSelectedProjectId("");
            }}
          />
        </>
      )}
    </div>
  );
};
