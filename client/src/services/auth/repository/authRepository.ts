import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig";

export const firebaseLogin = async (
  email: string,
  password: string
): Promise<UserCredential | undefined> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login error: ", error);
    throw error;
  }
};

export const firebaseRegisterUser = async (
  email: string,
  password: string
): Promise<UserCredential | undefined> => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Register error: ", error);
    return;
  }
};

export const firebaseLogout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error: ", error);
  }
};

export const firebaseOnAuthStateChanged = (
  callback: (user: User | null) => void
) => {
  const unsubscribe = onAuthStateChanged(auth, callback);
  return unsubscribe;
};
