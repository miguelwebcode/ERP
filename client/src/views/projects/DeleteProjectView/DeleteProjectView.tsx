import { useEffect, useRef, useState } from "react";
import SelectProjectForm from "../../../components/projects/SelectProjectForm/SelectProjectForm";
import { useAppStore } from "../../../stores/app-store";
import { deleteProjectById } from "../../../services/projects/repository/projectsRepository";
import { fetchProject } from "../../../services/projects/service/projectsService";
import { Project } from "../../../types";
import { SharedCard } from "../../../components/ui/SharedCard/SharedCard";
import { ProjectCard } from "../../../components/projects/ProjectCard/ProjectCard";
import { SharedButton } from "../../../components/ui/SharedButton/SharedButton";
import { SelectProjectFormValues } from "../../../types/form-values-types";
import { FormikHelpers } from "formik";

export const DeleteProjectView = () => {
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
    <div className="flex flex-col gap-ds-32 justify-center px-ds-20">
      <SelectProjectForm buttonText="FETCH PROJECT" onSubmit={handleSubmit} />
      {selectedProjectId && (
        <SharedCard>
          <ProjectCard project={selectedProject} />
          <div className="flex justify-center mb-ds-24 mx-ds-20">
            <button
              className="form-button"
              onClick={async () => {
                await deleteProjectById(selectedProjectId);
                setSelectedProjectId("");
              }}
            >
              <p className="text-ds-lg">DELETE</p>
            </button>
          </div>
        </SharedCard>
      )}
    </div>
  );
};
