import * as admin from "firebase-admin";
import { stripe } from "./firebaseConfig";
import { functions, db } from "./firebaseConfig";

export const createStripeCustomer = functions
  .region("europe-west1")
  .auth.user()
  .onCreate(async (user) => {
    // 1. Crear cliente en Stripe
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { firebaseUID: user.uid },
    });
    // 2. Guardar mapping en Firestore
    await db.doc(`stripeCustomers/${user.uid}`).set({
      stripeCustomerId: customer.id,
      email: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
