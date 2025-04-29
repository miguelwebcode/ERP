import { functions } from "@/firebaseConfig";
import {
  CheckoutSessionData,
  CheckoutSessionDetailsData,
  CheckoutSessionResponse,
  ListStripeProductsResponse,
} from "@/types/stripe-types";
import { httpsCallable } from "firebase/functions";
import type Stripe from "stripe";

export const createCheckoutSession = httpsCallable<
  CheckoutSessionData,
  CheckoutSessionResponse
>(functions, "createCheckoutSession");

export const getCheckoutSessionDetails = httpsCallable<
  CheckoutSessionDetailsData,
  Stripe.Checkout.Session
>(functions, "getCheckoutSessionDetails");

export const listStripeProducts = httpsCallable<
  void,
  ListStripeProductsResponse
>(functions, "listStripeProducts");
