import type Stripe from "stripe";
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

    // 2. Construir parámetros comunes
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: data.mode, // 'subscription' o 'payment'
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [{ price: data.priceId, quantity: 1 }],
      success_url: `${data.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${data.origin}/cancel`,
      client_reference_id: data.projectId, // útil para debugging
    };

    // 3. Añadir metadata de forma condicional
    if (data.mode === "subscription") {
      // Esto hace que la Subscription lleve tu projectId en metadata
      params.subscription_data = {
        metadata: { projectId: data.projectId },
      };
    } else {
      // Esto hace que el PaymentIntent lleve tu projectId en metadata
      params.payment_intent_data = {
        metadata: { projectId: data.projectId },
      };
    }

    // 4. Crear la sesión de Checkout con los parámetros finales
    const session = await stripe.checkout.sessions.create(params);

    const response: CheckoutSessionResponse = { sessionId: session.id };
    return response;
  });
