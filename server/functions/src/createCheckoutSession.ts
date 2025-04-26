import { stripe } from "./firebaseConfig";
import { db, functions } from "./firebaseConfig";
import { CheckoutSessionData, CheckoutSessionResponse } from "./types";

export const createCheckoutSession = functions
  .region("europe-west1")
  .https.onCall(async (data: CheckoutSessionData, context) => {
    const uid = context.auth?.uid;
    if (!uid)
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Authentication required."
      );

    // 1. Recuperar Stripe Customer
    const custDoc = await db.doc(`stripeCustomers/${uid}`).get();
    const customerId = custDoc.data()?.stripeCustomerId;

    // 2. Crear sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      mode: data.mode || "subscription", // o "payment" para pagos únicos
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [{ price: data.priceId, quantity: 1 }],
      success_url: `${data.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${data.origin}/cancel`,
      client_reference_id: data.projectId, // vinculamos con el projectId en Firestore
    });

    const response: CheckoutSessionResponse = { sessionId: session.id };

    return response;
  });
