import { NavButton } from "../../ui/NavButton/NavButton";
import { FaPlus } from "react-icons/fa";

export const NoProjectsFoundMessage = () => {
  return (
    <div className="flex flex-col gap-3 w-48">
      <p className="info-message">No projects found.</p>
      <p className="info-message">
        <span>Create</span> the first one.
      </p>
      <NavButton text="CREATE" Icon={FaPlus} route="/projects/add" />
    </div>
  );
};
