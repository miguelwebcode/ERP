import { MdOutlineDescription, MdOutlineWorkOutline } from "react-icons/md";
import { Project } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import { PiIdentificationBadge } from "react-icons/pi";
import { BsFileBarGraph } from "react-icons/bs";
import { LuUserRound } from "react-icons/lu";
import { IoCalendarOutline } from "react-icons/io5";

type ProjectCardProps = {
  project: Project;
  onButtonClick: () => Promise<void>;
};
export const ProjectCard = ({
  project,
  onButtonClick: handleButtonClick,
}: ProjectCardProps) => {
  return (
    <div className="w-full max-w-md p-6">
      <div className="mb-4 pb-3 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-600">
          <span className="font-semibold">ID</span>: {project.id}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-6">
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
      <div className="flex justify-center">
        <button
          className="w-full bg-red-500 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
          onClick={() => handleButtonClick()}
        >
          <p className="text-xl">DELETE</p>
        </button>
      </div>
    </div>
  );
};
