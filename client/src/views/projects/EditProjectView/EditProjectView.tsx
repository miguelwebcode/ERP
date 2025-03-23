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
    <>
      <h1 className="uppercase font-bold text-3xl text-center mb-10">
        Update Project
      </h1>

      <div className="flex flex-col gap-2 lg:flex-row justify-center px-5">
        {isRenderDone && (
          <>
            <SelectProjectForm
              buttonText="FETCH PROJECT"
              onSubmit={handleSubmit}
            />
            <ProjectForm
              titleText="EDIT PROJECT"
              submitButtonText="UPDATE PROJECT"
              canBeDisabled={true}
              onSubmit={async (
                values: ProjectFormValues,
                formikHelpers: FormikHelpers<ProjectFormValues>
              ) => {
                await handleEditProject(
                  selectedProjectId,
                  values,
                  formikHelpers
                );
                setSelectedProjectId("");
              }}
            />
          </>
        )}
      </div>
    </>
  );
};
