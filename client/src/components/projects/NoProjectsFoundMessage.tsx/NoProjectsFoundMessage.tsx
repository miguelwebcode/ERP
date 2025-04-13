import { NavButton } from "../../ui/NavButton/NavButton";
import { FaPlus } from "react-icons/fa";

export const NoProjectsFoundMessage = () => {
  return (
    <div className="flex flex-col gap-ds-12 w-ds-192">
      <p className="info-message">No projects found.</p>
      <p className="info-message">
        <span>Create</span> the first one.
      </p>
      <NavButton text="CREATE" Icon={FaPlus} route="/projects/add" />
    </div>
  );
};
