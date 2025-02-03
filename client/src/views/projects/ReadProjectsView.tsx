import { useState, useEffect } from "react";
import { Project } from "../../types";
import { getAllProjects } from "../../services/projects";
import { ProjectCard } from "../../components/projects/ProjectCard";
import { SharedCard } from "../../components/ui/SharedCard/SharedCard";

export const ReadProjectsView = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    const fetchAllprojects = async () => {
      const result = await getAllProjects();
      setProjects(result as Project[]);
    };
    fetchAllprojects();
  }, []);
  return (
    <div className="flex justify-center flex-wrap gap-6">
      {projects.map((project) => {
        return (
          <SharedCard>
            <ProjectCard project={project} />
          </SharedCard>
        );
      })}
    </div>
  );
};
