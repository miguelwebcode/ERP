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
import { db } from "../../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";

import { FormikHelpers } from "formik";
import { ProjectFormValues } from "../../../types/form-values-types";
import { formatDate } from "../..";
import { toast } from "react-toastify";

export const getAllProjects = async () => {
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
  const projectsCollection = collection(db, "projects");
  const q = query(projectsCollection, where("id", "==", projectId));

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
  const projectsCollection = collection(db, "projects");
  try {
    const querySnapshot = await getDocs(projectsCollection);
    const projectIds = querySnapshot.docs.map((doc) => doc.data().id);
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
      id: `P-${uuidv4().slice(0, 8)}`,
    });
    toast.success("Project created");
    formikHelpers.resetForm();
  } catch (error) {
    console.error("Error creating customer: ", error);
  }
};

export const handleEditProject = async (
  selectedProjectId: string,
  values: ProjectFormValues,
  formikHelpers: FormikHelpers<ProjectFormValues>
) => {
  const projectsCollection = collection(db, "projects");
  const q = query(projectsCollection, where("id", "==", selectedProjectId));
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
    toast.success("Project updated");
    formikHelpers.resetForm();
  } catch (error) {
    console.error("Error updating customer: ", error);
  }
};

export const deleteProjectById = async (projectId: string) => {
  const projectsCollection = collection(db, "projects");
  const q = query(projectsCollection, where("id", "==", projectId));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    const documentId = querySnapshot.docs[0].id;
    const projectDocRef = doc(db, "projects", documentId);

    await deleteDoc(projectDocRef);
    toast.success("Project deleted");
  } catch (error) {
    console.error("Error deleting project: ", error);
  }
};
