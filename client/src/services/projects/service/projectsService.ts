import { FormikProps } from "formik";
import { ActiveProjectsMonth, Project } from "../../../types";
import { ProjectFormValues } from "../../../types/form-values-types";
import {
  getAllProjectIds,
  getProjectById,
  getAllProjects,
  getActiveProjectsHistory,
} from "../repository/projectsRepository";

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
  try {
    const selectedProject = (await getProjectById(
      selectedProjectId
    )) as Project;
    if (selectedProject) {
      const newValues: ProjectFormValues = {
        name: selectedProject.name,
        state: selectedProject.state,
        description: selectedProject.description,
        startDate: selectedProject.startDate,
        endDate: selectedProject.endDate,
        customerId: selectedProject.customerId,
        employeeId: selectedProject.employeeId,
      };
      formik.setValues(newValues);
    }
  } catch (error) {
    console.error("Error fetching project: ", error);
  }
};

export const fetchProject = async (
  selectedProjectId: string,
  setSelectedProject: (value: React.SetStateAction<Project>) => void
) => {
  try {
    const result = await getProjectById(selectedProjectId);
    setSelectedProject(result as Project);
  } catch (error) {
    console.error("Error fetching project: ", error);
  }
};

export const fetchAllProjects = async (
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  try {
    const result = await getAllProjects();
    setProjects(result as Project[]);
  } catch (error) {
    console.error("Error fetching projects: ", error);
  }
};

export const fetchActiveProjectsHistory = async (
  callback: (value: ActiveProjectsMonth[]) => void
) => {
  const { data } = await getActiveProjectsHistory();
  callback(data);
};
