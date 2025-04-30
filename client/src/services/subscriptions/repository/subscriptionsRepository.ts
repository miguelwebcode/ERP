import { functions } from "@/firebaseConfig";
import { MrrMonth } from "@/types";
import { httpsCallable } from "firebase/functions";

export const getHistoricalMrr = httpsCallable<void, MrrMonth[]>(
  functions,
  "getHistoricalMrr"
);
