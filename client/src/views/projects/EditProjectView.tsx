import { useEffect, useState } from "react";
import { useAppStore } from "../../stores/app-store";
import { EditProjectForm } from "../../components/projects/EditProjectForm";
import ProjectForm from "../../components/projects/ProjectForm";
import { ProjectFormValues } from "../../types/form-values-types";
import { FormikHelpers } from "formik";
import { handleEditProject } from "../../services/projects";

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
  return (
    <div className="flex flex-col md:flex-row justify-center px-5">
      {isRenderDone && (
        <>
          <EditProjectForm />
          <ProjectForm
            titleText="EDIT PROJECT"
            submitButtonText="UPDATE PROJECT"
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
