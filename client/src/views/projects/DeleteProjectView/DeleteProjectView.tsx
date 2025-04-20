import { useEffect, useRef, useState } from "react";
import SelectProjectForm from "../../../components/projects/SelectProjectForm/SelectProjectForm";
import { useAppStore } from "../../../stores/app-store";
import { deleteProjectById } from "../../../services/projects/repository/projectsRepository";
import {
  fetchAllProjects,
  fetchProject,
} from "../../../services/projects/service/projectsService";
import { Project } from "../../../types";
import { SharedCard } from "../../../components/ui/SharedCard/SharedCard";
import { ProjectCard } from "../../../components/projects/ProjectCard/ProjectCard";
import { SelectProjectFormValues } from "../../../types/form-values-types";
import { FormikHelpers } from "formik";
import { NoProjectsFoundMessage } from "../../../components/projects/NoProjectsFoundMessage.tsx/NoProjectsFoundMessage";

export const DeleteProjectView = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project>(
    {} as Project
  );
  const selectedProjectId = useAppStore((state) => state.selectedProjectId);

  const setSelectedProjectId = useAppStore(
    (state) => state.setSelectedProjectId
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      setSelectedProjectId("");
      fetchAllProjects(setProjects);

      isFirstRender.current = false;
    }
    if (selectedProjectId) {
      fetchProject(selectedProjectId, setSelectedProject);
    }
  }, [selectedProjectId]);

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
      {projects.length ? (
        <div className="flex flex-col gap-8 justify-center px-5">
          <SelectProjectForm
            buttonText="FETCH PROJECT"
            onSubmit={handleSubmit}
          />
          {selectedProjectId && (
            <SharedCard>
              <ProjectCard project={selectedProject} />
              <div className="flex justify-center mb-6 mx-5">
                <button
                  className="form-button"
                  onClick={async () => {
                    await deleteProjectById(selectedProjectId);
                    setSelectedProjectId("");
                  }}
                >
                  <p className="text-xl">DELETE</p>
                </button>
              </div>
            </SharedCard>
          )}
        </div>
      ) : (
        <NoProjectsFoundMessage />
      )}
    </>
  );
};
