import {
  MdOutlineDescription,
  MdOutlineEditCalendar,
  MdOutlineWorkOutline,
} from "react-icons/md";
import { Project } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import { PiIdentificationBadge } from "react-icons/pi";
import { BsFileBarGraph } from "react-icons/bs";
import { LuCalendarPlus, LuUserRound } from "react-icons/lu";
import { IoCalendarOutline } from "react-icons/io5";

type ProjectCardProps = {
  project: Project;
};
export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <>
      <div className="flex gap-10">
        <div className="flex flex-col">
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
        </div>
        <div className="flex flex-col">
          <CardField
            label="State"
            value={project.state}
            Icon={BsFileBarGraph}
          />
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
          <CardField
            label="Created at"
            value={project.createdAt}
            Icon={LuCalendarPlus}
          />
          {project.updatedAt && (
            <CardField
              label="Updated at"
              value={project.updatedAt}
              Icon={MdOutlineEditCalendar}
            />
          )}
        </div>
      </div>
    </>
  );
};
