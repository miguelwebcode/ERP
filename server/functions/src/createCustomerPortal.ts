import { stripe } from "./firebaseConfig";
import { db, functions } from "./firebaseConfig";
import { CustomerPortalData, CustomerPortalResponse } from "./types";
import type Stripe from "stripe";

export const createCustomerPortal = functions
  .region("europe-west1")
  .https.onCall(
    async (
      data: CustomerPortalData,
      context
    ): Promise<CustomerPortalResponse> => {
      const uid = context.auth?.uid;
      if (!uid)
        throw new functions.https.HttpsError(
          "unauthenticated",
          "Auth required."
        );

      const custDoc = await db.doc(`stripeCustomers/${uid}`).get();
      console.log("custDoc: ", custDoc);
      console.log("stripeCustomerId: ", custDoc.data()?.stripeCustomerId);
      let session: Stripe.BillingPortal.Session;
      try {
        session = await stripe.billingPortal.sessions.create({
          customer: custDoc.data()?.stripeCustomerId,
          return_url: data.returnUrl,
        });
        return { url: session.url };
      } catch (error) {
        console.error("Error creando portal de cliente:", error);
        throw new functions.https.HttpsError(
          "internal",
          "No se pudo crear la sesión del Customer Portal."
        );
      }
    }
  );
