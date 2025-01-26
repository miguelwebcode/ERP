import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { FormikHelpers } from "formik";
import { CustomerFormValues } from "../types/form-values-types";

export const getAllCustomers = async () => {
  const user = auth.currentUser; // Obtén al usuario autenticado
  if (!user) {
    console.error("User not authenticated. Cannot read from Firestore.");
    return;
  }

  const customersCollection = collection(db, "customers");
  try {
    const querySnapshot = await getDocs(customersCollection);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });

    return querySnapshot;
  } catch (error) {
    console.error("Error reading customers: ", error);
  }
};

export const getCustomerById = async (customerId: string) => {
  const user = auth.currentUser; // Obtén al usuario autenticado
  if (!user) {
    console.error("User not authenticated. Cannot read from Firestore.");
    return;
  }

  const customersCollection = collection(db, "customers");
  const q = query(customersCollection, where("customerId", "==", customerId));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    const customerData = querySnapshot.docs[0].data();
    console.log("Customer data: ", customerData);
    return customerData;
  } catch (error) {
    console.error("Error reading customer: ", error);
  }
};

export const getAllCustomerIds = async () => {
  // const user = auth.currentUser; // Obtén al usuario autenticado
  // if (!user) {
  //   console.error("User not authenticated. Cannot read from Firestore.");
  //   return;
  // }

  const customersCollection = collection(db, "customers");
  try {
    const querySnapshot = await getDocs(customersCollection);
    const customerIds = querySnapshot.docs.map((doc) => doc.data().customerId);
    console.log("Customer IDs: ", customerIds);
    return customerIds;
  } catch (error) {
    console.error("Error reading customer IDs: ", error);
  }
};

export const handleCreateCustomer = async (
  values: CustomerFormValues,
  formikHelpers: FormikHelpers<CustomerFormValues>
) => {
  try {
    await addDoc(collection(db, "customers"), {
      ...values,
      createdAt: new Date().toISOString(),
      customerId: uuidv4(),
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
