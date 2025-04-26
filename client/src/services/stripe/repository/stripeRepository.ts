import { functions } from "@/firebaseConfig";
import { CheckoutSessionData, CheckoutSessionResponse } from "@/types/stripe";
import { httpsCallable } from "firebase/functions";
import type Stripe from "stripe";

export const createCheckoutSession = httpsCallable<
  CheckoutSessionData,
  CheckoutSessionResponse
>(functions, "createCheckoutSession");

export const getCheckoutSessionDetails = httpsCallable<
  { sessionId: string },
  Stripe.Checkout.Session
>(functions, "getCheckoutSessionDetails");
