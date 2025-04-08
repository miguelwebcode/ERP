import { MdOutlineDescription, MdOutlineWorkOutline } from "react-icons/md";
import { Project } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import { PiIdentificationBadge } from "react-icons/pi";
import { BsFileBarGraph } from "react-icons/bs";
import { LuUserRound } from "react-icons/lu";
import { IoCalendarOutline } from "react-icons/io5";

type ProjectCardProps = {
  project: Project;
};
export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="w-ds-384">
      <div className="bg-ds-primary-800 h-ds-32 rounded-t-ds-sm flex items-center justify-center">
        <p className="text-ds-white text-center">
          <span className="font-semibold">ID</span>: {project.customerId}
        </p>
      </div>
      <div className="grid grid-cols-2 p-ds-20 gap-y-ds-20 gap-x-ds-12">
        <CardField
          label="Name"
          value={project.name}
          Icon={MdOutlineWorkOutline}
        />
        <CardField
          label="Description"
          value={project.description}
          Icon={MdOutlineDescription}
        />
        <CardField
          label="Customer ID"
          value={project.customerId}
          Icon={PiIdentificationBadge}
        />
        <CardField
          label="Developer"
          value={project.developer}
          Icon={LuUserRound}
        />
        <CardField label="State" value={project.state} Icon={BsFileBarGraph} />
        <CardField
          label="Start Date"
          value={project.startDate}
          Icon={IoCalendarOutline}
        />
        <CardField
          label="End Date"
          value={project.endDate}
          Icon={IoCalendarOutline}
        />
      </div>
    </div>
  );
};
