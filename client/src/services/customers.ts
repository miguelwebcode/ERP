import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

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
