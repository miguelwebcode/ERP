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
import { db } from "../../../firebaseConfig";
import { FormikHelpers } from "formik";
import { EmployeeFormValues } from "../../../types/form-values-types";
import { formatDate } from "../..";
import { toast } from "react-toastify";

export const getAllEmployees = async () => {
  const employeesCollection = collection(db, "employees");
  try {
    const querySnapshot = await getDocs(employeesCollection);

    const employees = querySnapshot.docs.map((doc) => doc.data());
    return employees;
  } catch (error) {
    console.error("Error reading employees: ", error);
  }
};

export const getEmployeeById = async (employeeId: string) => {
  if (!employeeId) {
    console.log("Employee ID is empty");
    return;
  }

  const employeesCollection = collection(db, "employees");
  const q = query(employeesCollection, where("id", "==", employeeId));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    const employeeData = querySnapshot.docs[0].data();
    console.log("Employee data: ", employeeData);
    return employeeData;
  } catch (error) {
    console.error("Error reading employee: ", error);
  }
};

export const getAllEmployeeIds = async () => {
  const employeesCollection = collection(db, "employees");
  try {
    const querySnapshot = await getDocs(employeesCollection);
    const employeeIds = querySnapshot.docs.map((doc) => doc.data().id);
    console.log("Employee IDs: ", employeeIds);
    return employeeIds;
  } catch (error) {
    console.error("Error reading employee IDs: ", error);
  }
};

export const handleCreateEmployee = async (
  values: EmployeeFormValues,
  formikHelpers: FormikHelpers<EmployeeFormValues>
) => {
  try {
    const docRef = await addDoc(collection(db, "employees"), {
      ...values,
      createdAt: formatDate(new Date()),
    });

    await updateDoc(docRef, { id: docRef.id });

    toast.success("Employee created");
    formikHelpers.resetForm();
  } catch (error) {
    console.error("Error creating employee: ", error);
  }
};

export const handleEditEmployee = async (
  selectedEmployeeId: string,
  values: EmployeeFormValues,
  formikHelpers: FormikHelpers<EmployeeFormValues>
) => {
  try {
    const employeesCollection = collection(db, "employees");
    const q = query(employeesCollection, where("id", "==", selectedEmployeeId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    const documentId = querySnapshot.docs[0].id;

    const employeeDocRef = doc(db, "employees", documentId);

    await updateDoc(employeeDocRef, {
      ...values,
      updatedAt: formatDate(new Date()),
    });
    toast.success("Employee updated");
    formikHelpers.resetForm();
  } catch (error) {
    console.error("Error updating employee: ", error);
  }
};

export const deleteEmployeeById = async (employeeId: string) => {
  const employeesCollection = collection(db, "employees");
  const q = query(employeesCollection, where("id", "==", employeeId));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    const documentId = querySnapshot.docs[0].id;
    const employeeDocRef = doc(db, "employees", documentId);

    await deleteDoc(employeeDocRef);
    toast.success("Employee deleted");
  } catch (error) {
    console.error("Error deleting employee: ", error);
  }
};
