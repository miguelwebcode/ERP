import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import { db, functions } from "./firebaseConfig";
import { stripe, stripeSecret } from "./firebaseConfig";
import Stripe from "stripe";

const app = express();
app.use(cors({ origin: true }));
app.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"] as string,
      stripeSecret as string
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = event.data.object as any;
  switch (event.type) {
    case "customer.subscription.created":
      await db
        .collection("subscriptions")
        .doc(data.id)
        .set({
          stripeCustomerId: data.customer,
          projectId: data.metadata.client_reference_id,
          stripeSubscriptionId: data.id,
          status: data.status,
          currentPeriodEnd: data.current_period_end * 1000,
          amount: data.items.data[0].price.unit_amount,
          interval: data.items.data[0].price.recurring.interval,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    case "customer.subscription.updated":
      await db
        .collection("subscriptions")
        .doc(data.id)
        .set(
          {
            status: data.status,
            currentPeriodEnd: data.current_period_end * 1000,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      break;

    case "invoice.payment_succeeded":
      await db
        .collection("subscriptions")
        .doc(data.subscription)
        .set(
          {
            latestInvoice: data.id,
            lastPaymentAt: data.status_transitions?.paid_at * 1000,
          },
          { merge: true }
        );
      break;

    case "payment_intent.succeeded":
      // Si gestionas pagos únicos, guardar en /payments
      await db.collection("payments").add({
        stripeCustomerId: data.customer,
        projectId: data.metadata.client_reference_id,
        stripePaymentIntentId: data.id,
        amount: data.amount,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

export const stripeWebhook = functions
  .region("europe-west1")
  .https.onRequest(app);
