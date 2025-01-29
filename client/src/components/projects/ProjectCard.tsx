import { Project } from "../../types";

type ProjectCardProps = {
  project: Project;
};
export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="flex flex-col bg-slate-50 rounded-xl shadow-lg m-4 p-4 w-fit h-fit">
      <div className="flex mb-4 gap-1 items-center">
        <label className="block text-sm font-medium">Name:</label>
        <span className="text-md">{project.name}</span>
      </div>
      <div className="flex mb-4  gap-1 items-center">
        <label className="block text-sm font-medium">Description:</label>
        <span>{project.description}</span>
      </div>

      <div className="flex mb-4  gap-1 items-center">
        <label className="block text-sm font-medium">Customer ID:</label>
        <span className="text-md">{project.customerId}</span>
      </div>
      <div className="flex mb-4  gap-1 items-center">
        <label className="block text-sm font-medium">Start Date:</label>
        <span>{project.startDate}</span>
      </div>

      <div className="flex mb-4  gap-1 items-center">
        <label className="block text-sm font-medium">End Date:</label>
        <span className="text-md">{project.endDate}</span>
      </div>
      <div className="flex mb-4  gap-1 items-center">
        <label className="block text-sm font-medium">State:</label>
        <span>{project.state}</span>
      </div>
      <div className="flex mb-4  gap-1 items-center">
        <label className="block text-sm font-medium">Developer:</label>
        <span>{project.developer}</span>
      </div>
      <div className="flex flex-col mb-4 gap-1">
        <label className="block text-sm font-medium">Created at:</label>
        <span className="text-md">{project.createdAt}</span>
      </div>
      {project.updatedAt && (
        <div className="flex flex-col mb-4 gap-1">
          <label className="block text-sm font-medium">Updated at:</label>
          <span>{project.updatedAt}</span>
        </div>
      )}
    </div>
  );
};
