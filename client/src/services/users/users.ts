import { setDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Guardar datos adicionales del usuario en Firestore
export const saveUserData = async (uid: string, data: any) => {
  try {
    await setDoc(doc(db, "users", uid), data);
    console.log("User data saved");
  } catch (error) {
    console.error("Error saving user data: ", error);
    throw error;
  }
};

export async function getUsers() {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => doc.data());
}
