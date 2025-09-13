import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import * as functions from "firebase-functions/v1";
import * as dotenv from "dotenv";
import Stripe from "stripe";

// Load environment variables first
dotenv.config();

// Check if we're using emulator
const useEmulator = process.env.USE_EMULATOR === 'true';

// Configure Firestore emulator if in development
if (useEmulator) {
  console.log('🔧 Configuring Firebase for emulator mode');
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  console.log('📍 Firestore emulator host set to:', process.env.FIRESTORE_EMULATOR_HOST);
} else {
  console.log('🚀 Configuring Firebase for production mode');
}

let app: any;
app = initializeApp();

export const stripeSecret = process.env.STRIPE_SECRET as string;

// Use emulator webhook secret when in development, production secret otherwise
export const webhookSecret = useEmulator
  ? process.env.STRIPE_EMULATOR_WEBHOOK_SECRET as string
  : process.env.WEBHOOK_SECRET as string;

console.log(`🔐 Using webhook secret for ${useEmulator ? 'EMULATOR' : 'PRODUCTION'} mode`);

export const stripe = new Stripe(stripeSecret, {
  apiVersion: "2025-03-31.basil",
});

export const db = getFirestore(app);
export const auth = getAuth(app);
export { functions };
