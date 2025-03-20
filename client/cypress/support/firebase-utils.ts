import { db } from "../../cypress.config";
import { Customer } from "./types";
import { customerSchema } from "./schemas";

export const deleteCustomerByField = async (
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

export const getAllCustomers = async (): Promise<Customer[]> => {
  const collectionRef = db.collection("customers");
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log("No documents found in collection:", "customers");
    return [];
  }

  const documents: Customer[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    try {
      customerSchema.validateSync(data, { abortEarly: false });
      documents.push({ ...data } as Customer);
    } catch (error) {
      console.error("Validation error: ", error);
    }
  });

  return documents;
};

export const getCustomerById = async (
  customerId: string
): Promise<Customer | undefined> => {
  const customersRef = db.collection("customers");
  const snapshot = await customersRef
    .where("customerId", "==", customerId)
    .get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return undefined;
  }

  let customer: Customer | undefined;
  snapshot.forEach((doc) => {
    const data = doc.data();
    try {
      customerSchema.validateSync(data, { abortEarly: false });
      customer = { ...data } as Customer;
    } catch (error) {
      console.error("Validation error: ", error);
    }
  });

  return customer;
};

export const addCustomer = async (customer: Customer): Promise<string> => {
  try {
    customerSchema.validateSync(customer, { abortEarly: false });
    const docRef = await db.collection("customers").add(customer);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const deleteProjectByField = async (
  fieldName: string,
  fieldValue: string
) => {
  const projectsRef = db.collection("projects");
  const snapshot = await projectsRef.where(fieldName, "==", fieldValue).get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return 0;
  }

  let deleteCount = 0;
  for (const doc of snapshot.docs) {
    await db.collection("projects").doc(doc.id).delete();
    deleteCount++;
    console.log("deleted doc with id =>", doc.id);
  }
  return deleteCount;
};
