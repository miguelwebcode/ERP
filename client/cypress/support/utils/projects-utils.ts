import { db } from "../../../cypress.config";
import { projectSchema } from "../schemas";
import { Project } from "../types";

export const deleteProjectByField = async (
  fieldName: string,
  fieldValue: string
) => {
  const customersRef = db.collection("customers");
  const snapshot = await customersRef.where(fieldName, "==", fieldValue).get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return 0;
  }

  let deleteCount = 0;
  for (const doc of snapshot.docs) {
    await db.collection("customers").doc(doc.id).delete();
    deleteCount++;
    console.log("deleted doc with id =>", doc.id);
  }
  return deleteCount;
};

export const getAllProjects = async (): Promise<Project[]> => {
  const collectionRef = db.collection("projects");
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log("No documents found in collection:", "projects");
    return [];
  }

  const documents: Project[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    try {
      projectSchema.validateSync(data, { abortEarly: false });
      documents.push({ ...data } as Project);
    } catch (error) {
      console.error("Validation error: ", error);
    }
  });
  return documents;
};

export const getProjectById = async (
  projectId: string
): Promise<Project | undefined> => {
  const snapshot = await db
    .collection("projects")
    .where("id", "==", projectId)
    .get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return undefined;
  }

  let project: Project | undefined;
  snapshot.forEach((doc) => {
    const data = doc.data();
    try {
      projectSchema.validateSync(data, { abortEarly: false });
      project = { ...data } as Project;
    } catch (error) {
      console.error("Validation error: ", error);
    }
  });

  return project;
};

export const addProject = async (project: Project): Promise<string> => {
  try {
    projectSchema.validateSync(project, { abortEarly: false });
    const docRef = await db.collection("projects").add(project);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};
