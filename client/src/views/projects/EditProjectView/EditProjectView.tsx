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
import { Project } from "../../../types";
import { fetchAllProjects } from "../../../services/projects/service/projectsService";
import { NoProjectsFoundMessage } from "../../../components/projects/NoProjectsFoundMessage.tsx/NoProjectsFoundMessage";

export const EditProjectView = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedProjectId = useAppStore((state) => state.selectedProjectId);

  const setSelectedProjectId = useAppStore(
    (state) => state.setSelectedProjectId
  );

  useEffect(() => {
    fetchAllProjects((fetchedProjects) => {
      setProjects(fetchedProjects);
      setIsLoading(false);
    });

    selectedProjectId && setSelectedProjectId(selectedProjectId);

    return () => {
      setSelectedProjectId("");
    };
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

  if (isLoading) {
    return null;
  }

  return (
    <>
      {projects.length ? (
        <div className="flex flex-col gap-8 justify-center px-5">
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
        </div>
      ) : (
        <NoProjectsFoundMessage />
      )}
    </>
  );
};
