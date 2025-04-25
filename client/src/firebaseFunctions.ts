import { httpsCallable } from "firebase/functions";
import { functions } from "./firebaseConfig";

// Prepara la llamada a tu función createStripeCustomer
export const createStripeCustomer = httpsCallable<
  { projectId: string },
  { customerId: string }
>(functions, "createStripeCustomer");
