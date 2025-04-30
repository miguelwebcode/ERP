import * as functions from "firebase-functions/v1"; // Gen 1 explícito :contentReference[oaicite:0]{index=0}
import * as admin from "firebase-admin";
import Stripe from "stripe";
import { db, stripe, webhookSecret } from "./firebaseConfig";

export const stripeWebhook = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    // 1) Obtén la firma y rawBody
    const sig = req.headers["stripe-signature"] as string;
    const raw = (req as any).rawBody as Buffer;

    // 2) Verifica la firma
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
      console.log("✅ Webhook validado:", event.type);
    } catch (err: any) {
      console.error("❌ Firma inválida:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // 3) Procesa el evento sin devolver un Response
    const data = event.data.object as any;
    switch (event.type) {
      case "customer.subscription.created":
        await db
          .collection("subscriptions")
          .doc(data.id)
          .set({
            stripeCustomerId: data.customer,
            projectId: data.metadata.projectId,
            stripeSubscriptionId: data.id,
            status: data.status,
            currentPeriodEnd: data.current_period_end * 1000,
            amount: data.items.data[0].price.unit_amount,
            interval: data.items.data[0].price.recurring.interval,
            createdAt: admin.firestore.Timestamp.now().toMillis(),
          });
        break;

      case "customer.subscription.updated":
        const updates: any = {
          status: data.status,
          currentPeriodEnd: data.current_period_end * 1000,
          updatedAt: admin.firestore.Timestamp.now().toMillis(),
        };
        if (data.status === "canceled" || data.cancel_at_period_end) {
          updates.canceledAt = admin.firestore.Timestamp.now().toMillis();
        }
        await db
          .collection("subscriptions")
          .doc(data.id)
          .set(updates, { merge: true });
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
        await db.collection("payments").add({
          stripeCustomerId: data.customer,
          projectId: data.metadata.projectId,
          stripePaymentIntentId: data.id,
          amount: data.amount,
          createdAt: admin.firestore.Timestamp.now().toMillis(),
        });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // 4) Confirma recepción sin devolver Response
    res.json({ received: true });
  });
