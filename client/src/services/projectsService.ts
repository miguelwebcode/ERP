import { FormikProps } from "formik";
import { Project } from "../types";
import { ProjectFormValues } from "../types/form-values-types";
import { getAllProjectIds, getProjectById, getAllProjects } from "./projects";

export const fetchProjectIds = async (callback: (ids: string[]) => void) => {
  try {
    const ids: string[] = (await getAllProjectIds()) || [];
    callback(ids);
  } catch (error) {
    console.error("Error fetching project IDs: ", error);
  }
};

export const setProjectFormValues = async (
  formik: FormikProps<ProjectFormValues>,
  selectedProjectId: string
) => {
  const selectedProject = (await getProjectById(selectedProjectId)) as Project;
  if (selectedProject) {
    const newValues: ProjectFormValues = {
      customerId: selectedProject.customerId,
      description: selectedProject.description,
      startDate: selectedProject.startDate,
      endDate: selectedProject.endDate,
      name: selectedProject.name,
      state: selectedProject.state,
      developer: selectedProject.developer,
    };
    formik.setValues(newValues);
  }
};

export const fetchProject = async (
  selectedProjectId: string,
  setSelectedProject: (value: React.SetStateAction<Project>) => void
) => {
  const result = await getProjectById(selectedProjectId);
  setSelectedProject(result as Project);
};

export const fetchAllProjects = async (
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  const result = await getAllProjects();
  setProjects(result as Project[]);
};
