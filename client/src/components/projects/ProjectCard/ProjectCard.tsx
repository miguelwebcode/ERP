import { Project } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";

type ProjectCardProps = {
  project: Project;
};
export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <>
      <div className="flex gap-10">
        <div className="flex flex-col">
          <CardField label="Name" value={project.name} />
          <CardField label="Description" value={project.description} />
          <CardField label="Customer ID" value={project.customerId} />
          <CardField label="Developer" value={project.developer} />
        </div>
        <div className="flex flex-col">
          <CardField label="State" value={project.state} />
          <CardField label="Start Date" value={project.startDate} />
          <CardField label="End Date" value={project.endDate} />
          <CardField label="Created at" value={project.createdAt} />
          {project.updatedAt && (
            <CardField label="Updated at" value={project.updatedAt} />
          )}
        </div>
      </div>
    </>
  );
};
