import { useState, useEffect } from "react";
import { Project } from "../../types";
import { getAllProjects } from "../../services/projects";
import { ProjectCard } from "../../components/projects/ProjectCard";

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
    <div className="flex justify-center flex-wrap">
      {projects.map((project) => {
        return <ProjectCard project={project} />;
      })}
    </div>
  );
};
