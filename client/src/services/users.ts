import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

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
