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
      <h1 className="uppercase font-bold text-3xl text-center mb-10">
        Add Project
      </h1>
      <div className="flex justify-center">
        {isRenderDone && (
          <ProjectForm
            titleText="NEW PROJECT"
            submitButtonText="CREATE PROJECT"
            onSubmit={handleCreateProject}
          />
        )}
      </div>
    </>
  );
};
