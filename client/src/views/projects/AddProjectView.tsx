import ProjectForm from "../../components/projects/ProjectForm";
import { handleCreateProject } from "../../services/projects";

export const AddProjectView = () => {
  return (
    <div className="flex justify-center">
      <ProjectForm
        titleText="NEW PROJECT"
        submitButtonText="CREATE PROJECT"
        onSubmit={handleCreateProject}
      />
    </div>
  );
};
