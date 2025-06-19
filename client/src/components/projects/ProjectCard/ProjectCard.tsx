import { Project } from "../../../types";
import { CardField } from "../../ui/CardField/CardField";
import "@/styles/DataCard.css";
import { AppIcon } from "@/config/plugins/icons.plugin";
type ProjectCardProps = {
  project: Project;
  onButtonClick: () => Promise<void>;
};
export const ProjectCard = ({
  project,
  onButtonClick: handleButtonClick,
}: ProjectCardProps) => {
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
          Icon={() => <AppIcon name={"projectName"} />}
        />
        <CardField
          label="Description"
          value={project.description}
          Icon={() => <AppIcon name={"description"} />}
        />
        <CardField
          label="Customer ID"
          value={project.customerId}
          Icon={() => <AppIcon name={"customerId"} />}
        />
        <CardField
          label="Employee ID"
          value={project.employeeId}
          Icon={() => <AppIcon name={"employeeId"} />}
        />
        <CardField
          label="State"
          value={project.state}
          Icon={() => <AppIcon name={"state"} />}
        />
        <CardField
          label="Start Date"
          value={project.startDate}
          Icon={() => <AppIcon name={"startDate"} />}
        />
        <CardField
          label="End Date"
          value={project.endDate}
          Icon={() => <AppIcon name={"endDate"} />}
        />
      </div>
      <div className="flex justify-center mb-6 mx-5">
        <button className="form-button" onClick={() => handleButtonClick()}>
          <p className="text-xl">DELETE</p>
        </button>
      </div>
    </div>
  );
};
