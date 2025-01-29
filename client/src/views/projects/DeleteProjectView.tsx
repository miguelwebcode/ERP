import { useEffect, useRef, useState } from "react";
import DeleteProjectForm from "../../components/projects/DeleteProjectForm";
import { useAppStore } from "../../stores/app-store";
import { deleteProjectById, getProjectById } from "../../services/projects";
import { Project } from "../../types";
import { SharedCard } from "../../components/ui/SharedCard";
import { ProjectCard } from "../../components/projects/ProjectCard";
import { SharedButton } from "../../components/ui/SharedButton";

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
  return (
    <div className="flex flex-col md:flex-row justify-center px-5">
      <>
        <DeleteProjectForm />
        {selectedProjectId && (
          <SharedCard>
            <ProjectCard project={selectedProject} />
            <SharedButton
              text="DELETE PROJECT"
              handleClick={async () => {
                await deleteProjectById(selectedProjectId);
                setSelectedProjectId("");
              }}
            />
          </SharedCard>
        )}
      </>
    </div>
  );
};
