import { MdOutlineDescription, MdOutlineWorkOutline } from "react-icons/md";
import { Project } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import { PiIdentificationBadge } from "react-icons/pi";
import { BsFileBarGraph } from "react-icons/bs";
import { LuUserRound } from "react-icons/lu";
import { IoCalendarOutline } from "react-icons/io5";
import "@styles/CardInfo.css";
type ProjectCardProps = {
  project: Project;
};
export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="card-container">
      <div className="card-id-section">
        <p>
          <span>ID</span>: {project.id}
        </p>
      </div>
      <div className="card-grid">
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
          label="Employee"
          value={project.employeeId}
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
