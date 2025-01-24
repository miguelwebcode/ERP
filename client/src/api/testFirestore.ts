import { auth, db } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const testWriteCustomer = async () => {
  const user = auth.currentUser; // Obtén al usuario autenticado
  if (!user) {
    console.error("User not authenticated. Cannot write to Firestore.");
    return;
  }

  const customersCollection = collection(db, "customers");
  try {
    await addDoc(customersCollection, {
      name: "John Doe",
      email: "johndoe@email.com",
      company: "eCorp",
      createdAt: new Date(),
      createdBy: user.uid, // Opcional: puedes guardar el UID del creador
    });
    console.log("Customer added successfully!");
  } catch (error) {
    console.error("Error adding customer: ", error);
  }
};

export const testReadCustomers = async () => {
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
  } catch (error) {
    console.error("Error reading customers: ", error);
  }
};
