import { User } from "firebase/auth";
import {
  firebaseLogin,
  firebaseLogout,
  firebaseOnAuthStateChanged,
  firebaseRegisterUser,
} from "../repository/authRepository";

// Función para iniciar sesión, testear con firebase emulator
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await firebaseLogin(email, password);
    if (userCredential) {
      console.log("User signed in: ", userCredential.user);
      return userCredential.user;
    }
  } catch (error) {
    console.error("Error signing in: ", error);
  }
};

// Función para observar los cambios en el estado de autenticación
export const watchAuthState = (callback: (user: User | null) => void) => {
  firebaseOnAuthStateChanged((user) => {
    callback(user);
  });
};

// Función para cerrar sesión
export const logout = async () => {
  try {
    await firebaseLogout();
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

// Función para registrar un nuevo usuario
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await firebaseRegisterUser(email, password);
    if (userCredential) {
      console.log("User registered: ", userCredential.user);
      return userCredential.user;
    }
  } catch (error) {
    console.error("Error registering user: ", error);
  }
};
