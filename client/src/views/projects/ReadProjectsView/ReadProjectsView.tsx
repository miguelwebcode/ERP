import { useState, useEffect } from "react";
import { Project } from "../../../types";
import { fetchAllProjects } from "../../../services/projects/service/projectsService";
import { ProjectCard } from "../../../components/projects/ProjectCard/ProjectCard";
import { SharedCard } from "../../../components/ui/SharedCard/SharedCard";
import { NoProjectsFoundMessage } from "../../../components/projects/NoProjectsFoundMessage.tsx/NoProjectsFoundMessage";
import { projectColumns } from "@/components/projects/projectColumns/projectColumns";
import { DataTable } from "@/components/ui/data-table";

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
        <div className="container mx-auto md:mx-10 py-10">
          <DataTable columns={projectColumns} data={projects} />
        </div>
      ) : (
        <NoProjectsFoundMessage />
      )}
    </>
  );
};
