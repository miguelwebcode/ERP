// functions/src/index.ts
import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as dotenv from "dotenv";
import Stripe from "stripe";

// 1. Carga variables .env en desarrollo
dotenv.config();

// 2. Inicializa Admin SDK
admin.initializeApp();
const db = admin.firestore();

// 3. Obtén la clave secreta de Stripe
const stripeSecret = process.env.STRIPE_SECRET;
if (!stripeSecret) {
  throw new Error(
    "❌ STRIPE_SECRET no está definido en las variables de entorno."
  );
}

// 4. Inicializa Stripe
const stripe = new Stripe(stripeSecret, {
  apiVersion: "2025-03-31.basil",
});

// 5. Función Callable (v2) para crear un Customer
export const createStripeCustomer = onCall(
  { region: "us-central1" },
  async (request) => {
    // 5.1. Verifica que venga autenticado
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "Login requerido.");
    }

    // 5.2. Extrae projectId del payload
    const { projectId } = request.data as { projectId: string };
    if (!projectId) {
      throw new HttpsError("invalid-argument", "Missing projectId");
    }

    // 5.3. Crea el Customer en Stripe con metadata
    const customer = await stripe.customers.create({
      metadata: { firebaseUID: uid, projectId },
    });

    // 5.4. Guarda el customerId en Firestore
    await db
      .collection("projects")
      .doc(projectId)
      .set({ stripeCustomerId: customer.id }, { merge: true });

    // 5.5. Retorna el ID al cliente
    return { customerId: customer.id };
  }
);
