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

import { FormikHelpers } from "formik";
import { ProjectFormValues } from "../types/form-values-types";

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
      createdAt: new Date().toISOString(),
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
      updatedAt: new Date().toISOString(),
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
