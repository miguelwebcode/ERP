import { useState, useEffect } from "react";
import { Project } from "../../../types";
import { fetchAllProjects } from "../../../services/projects/service/projectsService";
import { ProjectCard } from "../../../components/projects/ProjectCard/ProjectCard";
import { SharedCard } from "../../../components/ui/SharedCard/SharedCard";

export const ReadProjectsView = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    fetchAllProjects(setProjects);
  }, []);
  return (
    <>
      <h1 className="uppercase font-bold text-3xl text-center mb-10">
        All Projects
      </h1>
      <div className="flex justify-center flex-wrap gap-6">
        {projects.map((project, i) => {
          return (
            <SharedCard key={i}>
              <ProjectCard project={project} />
            </SharedCard>
          );
        })}
      </div>
    </>
  );
};
