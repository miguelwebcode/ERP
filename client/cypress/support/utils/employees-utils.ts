import { db } from "../../../cypress.config";
import { employeeSchema } from "../schemas";
import { Employee } from "../types";

export const deleteEmployeeByField = async (
  fieldName: string,
  fieldValue: string
) => {
  const employeesRef = db.collection("employees");
  const snapshot = await employeesRef.where(fieldName, "==", fieldValue).get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return 0;
  }

  let deleteCount = 0;
  for (const doc of snapshot.docs) {
    await db.collection("employees").doc(doc.id).delete();
    deleteCount++;
    console.log("deleted doc with id =>", doc.id);
  }
  return deleteCount;
};

export const getAllEmployees = async (): Promise<Employee[]> => {
  const collectionRef = db.collection("employees");
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log("No documents found in collection:", "employees");
    return [];
  }

  const documents: Employee[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    try {
      employeeSchema.validateSync(data, { abortEarly: false });
      documents.push({ ...data } as Employee);
    } catch (error) {
      console.error("Validation error: ", error);
    }
  });

  return documents;
};

export const getEmployeeById = async (
  employeeId: string
): Promise<Employee | undefined> => {
  const snapshot = await db
    .collection("employees")
    .where("id", "==", employeeId)
    .get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return undefined;
  }

  let employee: Employee | undefined;
  snapshot.forEach((doc) => {
    const data = doc.data();
    try {
      employeeSchema.validateSync(data, { abortEarly: false });
      employee = { ...data } as Employee;
    } catch (error) {
      console.error("Validation error: ", error);
    }
  });

  return employee;
};

export const addEmployee = async (employee: Employee): Promise<string> => {
  try {
    employeeSchema.validateSync(employee, { abortEarly: false });
    const docRef = await db.collection("employees").add(employee);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};
