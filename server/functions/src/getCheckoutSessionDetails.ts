import { functions, stripe } from "./firebaseConfig";
import { CheckoutSessionDetailsData } from "./types";
import Stripe from "stripe";

export const getCheckoutSessionDetails = functions
  .region("europe-west1")
  .https.onCall(
    async (
      data: CheckoutSessionDetailsData
    ): Promise<Stripe.Checkout.Session> => {
      try {
        const session = await stripe.checkout.sessions.retrieve(
          data.sessionId,
          {
            expand: ["customer", "line_items"],
          }
        );
        return session;
      } catch (error) {
        console.error("Error getting checkout session details: ", error);
        throw error;
      }
    }
  );
