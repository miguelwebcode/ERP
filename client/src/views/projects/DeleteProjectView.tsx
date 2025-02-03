import { useEffect, useRef, useState } from "react";
import SelectProjectForm from "../../components/projects/SelectProjectForm";
import { useAppStore } from "../../stores/app-store";
import { deleteProjectById, getProjectById } from "../../services/projects";
import { Project } from "../../types";
import { SharedCard } from "../../components/ui/SharedCard/SharedCard";
import { ProjectCard } from "../../components/projects/ProjectCard";
import { SharedButton } from "../../components/ui/SharedButton/SharedButton";
import { SelectProjectFormValues } from "../../types/form-values-types";
import { FormikHelpers } from "formik";

export const DeleteProjectView = () => {
  const selectedProjectId = useAppStore((state) => state.selectedProjectId);
  const [selectedProject, setSelectedProject] = useState<Project>(
    {} as Project
  );

  const setSelectedProjectId = useAppStore(
    (state) => state.setSelectedProjectId
  );

  const fetchProject = async () => {
    const result = await getProjectById(selectedProjectId);
    setSelectedProject(result as Project);
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      setSelectedProjectId("");
      isFirstRender.current = false;
    }
    if (selectedProjectId) {
      fetchProject();
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
    <div className="flex flex-col md:flex-row justify-center px-5">
      <>
        <SelectProjectForm buttonText="FETCH PROJECT" onSubmit={handleSubmit} />
        {selectedProjectId && (
          <SharedCard>
            <ProjectCard project={selectedProject} />
            <div className="flex justify-center">
              <SharedButton
                text="DELETE PROJECT"
                handleClick={async () => {
                  await deleteProjectById(selectedProjectId);
                  setSelectedProjectId("");
                }}
              />
            </div>
          </SharedCard>
        )}
      </>
    </div>
  );
};
