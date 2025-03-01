import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig";

export const firebaseLogin = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login error: ", error);
  }
};

export const firebaseRegisterUser = async (email: string, password: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Register error: ", error);
  }
};

export const firebaseLogout = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error("Logout error: ", error);
  }
};

export const firebaseOnAuthStateChanged = (
  callback: (user: User | null) => void
) => {
  onAuthStateChanged(auth, callback);
};
