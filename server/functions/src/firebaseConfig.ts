import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import * as functions from "firebase-functions/v1";
import * as dotenv from "dotenv";
import Stripe from "stripe";

// export const functions = gen1;
let app: any;

dotenv.config();

dotenv.config();

app = initializeApp();

export const stripeSecret = process.env.STRIPE_SECRET as string;
export const stripe = new Stripe(stripeSecret, {
  apiVersion: "2025-03-31.basil",
});

export const db = getFirestore(app);
export const auth = getAuth(app);
export { functions };
