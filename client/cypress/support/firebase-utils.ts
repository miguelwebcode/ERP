import { db } from "../../cypress.config";

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
