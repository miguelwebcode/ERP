import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { v4 as uuidv4 } from "uuid";

import { FormikHelpers, FormikProps } from "formik";
import { ProjectFormValues } from "../types/form-values-types";
import { formatDate } from ".";
import { Project } from "../types";

export const getAllProjects = async () => {
  const user = auth.currentUser; // Obtén al usuario autenticado
  if (!user) {
    console.error("User not authenticated. Cannot read from Firestore.");
    return;
  }

  const projectsCollection = collection(db, "projects");
  try {
    const querySnapshot = await getDocs(projectsCollection);

    const projects = querySnapshot.docs.map((doc) => doc.data());
    return projects;
  } catch (error) {
    console.error("Error reading projects: ", error);
  }
};

export const getProjectById = async (projectId: string) => {
  const user = auth.currentUser; // Obtén al usuario autenticado
  if (!user) {
    console.error("User not authenticated. Cannot read from Firestore.");
    return;
  }

  const projectsCollection = collection(db, "projects");
  const q = query(projectsCollection, where("projectId", "==", projectId));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    const projectData = querySnapshot.docs[0].data();
    console.log("project data: ", projectData);
    return projectData;
  } catch (error) {
    console.error("Error reading project: ", error);
  }
};

export const getAllProjectIds = async () => {
  const user = auth.currentUser; // Obtén al usuario autenticado
  if (!user) {
    console.error("User not authenticated. Cannot read from Firestore.");
    return;
  }

  const projectsCollection = collection(db, "projects");
  try {
    const querySnapshot = await getDocs(projectsCollection);
    const projectIds = querySnapshot.docs.map((doc) => doc.data().projectId);
    return projectIds;
  } catch (error) {
    console.error("Error reading project IDs: ", error);
  }
};

export const handleCreateProject = async (
  values: ProjectFormValues,
  formikHelpers: FormikHelpers<ProjectFormValues>
) => {
  try {
    await addDoc(collection(db, "projects"), {
      ...values,
      createdAt: formatDate(new Date()),
      projectId: uuidv4(),
    });
    /* 
       TODO: Show notification
      */
    alert("Customer created successfully!");
    formikHelpers.resetForm();
  } catch (error) {
    console.error("Error creating customer: ", error);
    alert("Error creating customer!");
  }
};

export const handleEditProject = async (
  selectedProjectId: string,
  values: ProjectFormValues,
  formikHelpers: FormikHelpers<ProjectFormValues>
) => {
  const projectsCollection = collection(db, "projects");
  const q = query(
    projectsCollection,
    where("projectId", "==", selectedProjectId)
  );
  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    const documentId = querySnapshot.docs[0].id;

    const customerDocRef = doc(db, "projects", documentId);

    await updateDoc(customerDocRef, {
      ...values,
      updatedAt: formatDate(new Date()),
    });
    alert("Customer updated successfully!");
    formikHelpers.resetForm();
  } catch (error) {
    console.error("Error updating customer: ", error);
    alert("Error updating customer!");
  }
};

export const deleteProjectById = async (projectId: string) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User not authenticated. Cannot delete from Firestore.");
    return;
  }

  const projectsCollection = collection(db, "projects");
  const q = query(projectsCollection, where("projectId", "==", projectId));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    const documentId = querySnapshot.docs[0].id;
    const projectDocRef = doc(db, "projects", documentId);

    await deleteDoc(projectDocRef);
    alert("Project deleted successfully!");
  } catch (error) {
    console.error("Error deleting project: ", error);
  }
};

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
