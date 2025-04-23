import { useState, useEffect } from "react";
import { Project } from "../../../types";
import { fetchAllProjects } from "../../../services/projects/service/projectsService";
import { ProjectCard } from "../../../components/projects/ProjectCard/ProjectCard";
import { SharedCard } from "../../../components/ui/SharedCard/SharedCard";
import { NoProjectsFoundMessage } from "../../../components/projects/NoProjectsFoundMessage.tsx/NoProjectsFoundMessage";

export const ReadProjectsView = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllProjects((fetchedProjects) => {
      setProjects(fetchedProjects);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <>
      {projects.length ? (
        <div className="flex justify-center flex-wrap gap-6 h-[80vh] overflow-y-auto">
          {projects.map((project, i) => (
            <SharedCard key={i}>
              <ProjectCard project={project} />
            </SharedCard>
          ))}
        </div>
      ) : (
        <NoProjectsFoundMessage />
      )}
    </>
  );
};
