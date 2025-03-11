import { ProjectsNavigationCard } from "../../../components/projects/ProjectsNavigationCard/ProjectsNavigationCard";

export const ProjectsView = () => {
  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="uppercase font-bold text-3xl">PROJECTS</h1>

      <ProjectsNavigationCard />
    </div>
  );
};
