import { functions } from "@/firebaseConfig";
import { CheckoutSessionData, CheckoutSessionResponse } from "@/types/stripe";
import { httpsCallable } from "firebase/functions";

export const createCheckoutSession = httpsCallable<
  CheckoutSessionData,
  CheckoutSessionResponse
>(functions, "createCheckoutSession");
