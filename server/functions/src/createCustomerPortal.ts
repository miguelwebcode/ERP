import { stripe } from "./firebaseConfig";
import { db, functions } from "./firebaseConfig";

export const createCustomerPortal = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const uid = context.auth?.uid;
    if (!uid)
      throw new functions.https.HttpsError("unauthenticated", "Auth required.");

    const custDoc = await db.doc(`stripeCustomers/${uid}`).get();
    const session = await stripe.billingPortal.sessions.create({
      customer: custDoc.data()?.stripeCustomerId,
      return_url: data.returnUrl,
    });

    return { url: session.url };
  });
