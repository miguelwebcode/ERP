import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebaseConfig";

export const callCloud = (name: string) => {
  return httpsCallable(functions, name);
};
