import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { FormikHelpers, FormikProps } from "formik";
import { CustomerFormValues } from "../../types/form-values-types";
import { formatDate } from "..";
import { Customer } from "../../types";

export const getAllCustomers = async () => {
  const user = auth.currentUser; // Obtén al usuario autenticado
  if (!user) {
    console.error("User not authenticated. Cannot read from Firestore.");
    return;
  }

  const customersCollection = collection(db, "customers");
  try {
    const querySnapshot = await getDocs(customersCollection);

    const customers = querySnapshot.docs.map((doc) => doc.data());
    return customers;
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

  if (!customerId) {
    console.log("Customer ID is empty");
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
  const user = auth.currentUser; // Obtén al usuario autenticado
  if (!user) {
    console.error("User not authenticated. Cannot read from Firestore.");
    return;
  }

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
      createdAt: formatDate(new Date()),
      customerId: uuidv4(),
    });
    /* 
     TODO: Show notification
    */
    formikHelpers.resetForm();
  } catch (error) {
    console.error("Error creating customer: ", error);
  }
};

export const handleEditCustomer = async (
  selectedCustomerId: string,
  values: CustomerFormValues,
  formikHelpers: FormikHelpers<CustomerFormValues>
) => {
  const customersCollection = collection(db, "customers");
  const q = query(
    customersCollection,
    where("customerId", "==", selectedCustomerId)
  );
  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    const documentId = querySnapshot.docs[0].id;

    const customerDocRef = doc(db, "customers", documentId);

    await updateDoc(customerDocRef, {
      ...values,
      updatedAt: formatDate(new Date()),
    });
    formikHelpers.resetForm();
  } catch (error) {
    console.error("Error updating customer: ", error);
  }
};

export const deleteCustomerById = async (customerId: string) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User not authenticated. Cannot delete from Firestore.");
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

    const documentId = querySnapshot.docs[0].id;
    const customerDocRef = doc(db, "customers", documentId);

    await deleteDoc(customerDocRef);
  } catch (error) {
    console.error("Error deleting customer: ", error);
  }
};

export const fetchCustomerIds = async (callback: (ids: string[]) => void) => {
  try {
    const ids: string[] = (await getAllCustomerIds()) || [];
    callback(ids);
  } catch (error) {
    console.error("Error fetching customer IDs: ", error);
  }
};

export const setCustomerFormValues = async (
  formik: FormikProps<CustomerFormValues>,
  selectedCustomerId: string
) => {
  const selectedCustomer = (await getCustomerById(
    selectedCustomerId
  )) as Customer;
  if (selectedCustomer) {
    const newValues: CustomerFormValues = {
      address: selectedCustomer.address,
      company: selectedCustomer.company,
      email: selectedCustomer.email,
      name: selectedCustomer.name,
      phone: selectedCustomer.phone,
      project: selectedCustomer.project,
    };
    formik.setValues(newValues);
  }
};

export const fetchCustomer = async (
  selectedCustomerId: string,
  callback: (value: React.SetStateAction<Customer>) => void
) => {
  const result = await getCustomerById(selectedCustomerId);
  callback(result as Customer);
};

export const fetchAllCustomers = async (
  callback: (value: React.SetStateAction<Customer[]>) => void
) => {
  const result = await getAllCustomers();
  callback(result as Customer[]);
};
