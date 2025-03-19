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
