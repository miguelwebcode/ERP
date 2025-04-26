import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebaseConfig";

export const callCloudFunction = (name: string) => {
  return httpsCallable(functions, name);
};
