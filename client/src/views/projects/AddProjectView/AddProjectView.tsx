import { useState, useEffect } from "react";
import ProjectForm from "../../../components/projects/ProjectForm/ProjectForm";
import { handleCreateProject } from "../../../services/projects/repository/projectsRepository";
import { useAppStore } from "../../../stores/app-store";

export const AddProjectView = () => {
  const [isRenderDone, setIsRenderDone] = useState(false);

  const setSelectedProjectId = useAppStore(
    (state) => state.setSelectedProjectId
  );

  useEffect(() => {
    setSelectedProjectId("");
    setIsRenderDone(true);
  });
  return (
    <>
      {isRenderDone && (
        <ProjectForm
          titleText="NEW PROJECT"
          submitButtonText="CREATE"
          onSubmit={handleCreateProject}
        />
      )}
    </>
  );
};
