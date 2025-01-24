import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

// Función para iniciar sesión
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed in: ", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};

// Función para observar los cambios en el estado de autenticación
export const watchAuthState = (callback: (user: User | null) => void) => {
  onAuthStateChanged(auth, (user) => {
    // El parámetro 'user' ya tiene el tipo 'User | null' gracias al SDK de Firebase
    callback(user);
  });
};

// Función para cerrar sesión
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

// Función para registrar un nuevo usuario
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User registered: ", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error registering user: ", error);
    throw error;
  }
};
