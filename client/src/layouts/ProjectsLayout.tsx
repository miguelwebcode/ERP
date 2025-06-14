import { Outlet } from "react-router-dom";
import { ProjectsNavigationCard } from "../components/projects/ProjectsNavigationCard/ProjectsNavigationCard";

export default function ProjectsLayout() {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start h-[80vh] pt-4 gap-4 ">
      <ProjectsNavigationCard />
      <div className="flex flex-1 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
