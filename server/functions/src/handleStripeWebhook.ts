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
      console.log("✅ Webhook validado:", event.type, `[${event.id}]`);
    } catch (err: any) {
      console.error("❌ Firma inválida:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // 3) Procesa el evento con manejo de errores robusto
    const data = event.data.object as any;

    try {
      console.log(`🔄 Processing event ${event.type} [${event.id}]`);

      switch (event.type) {
        case "customer.subscription.created":
          await handleSubscriptionCreated(data, event.id);
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(data, event.id);
          break;

        case "invoice.payment_succeeded":
          await handleInvoicePaymentSucceeded(data, event.id);
          break;

        case "payment_intent.succeeded":
          await handlePaymentIntentSucceeded(data, event.id);
          break;

        default:
          console.log(`ℹ️ Unhandled event type ${event.type} [${event.id}]`);
      }

      console.log(`✅ Successfully processed ${event.type} [${event.id}]`);
    } catch (error: any) {
      console.error(`❌ Error processing ${event.type} [${event.id}]:`, error.message);
      console.error('Event data:', JSON.stringify(data, null, 2));
      // Return 500 to let Stripe retry the webhook
      res.status(500).send(`Processing Error: ${error.message}`);
      return;
    }

    // 4) Confirma recepción
    res.json({ received: true });
  });

// Helper function to safely get nested properties
function safeGet(obj: any, path: string, defaultValue: any = null) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue;
  }, obj);
}

// Helper function to safely get array item
function safeGetArrayItem(arr: any[], index: number, path?: string, defaultValue: any = null) {
  if (!Array.isArray(arr) || arr.length <= index) return defaultValue;
  const item = arr[index];
  return path ? safeGet(item, path, defaultValue) : item;
}

async function handleSubscriptionCreated(data: any, eventId: string) {
  console.log(`📋 Processing subscription creation for ${data.id}`);

  // Extract data with safe access and fallbacks
  const stripeCustomerId = data.customer || null;
  const projectId = safeGet(data, 'metadata.projectId', 'unknown');
  const status = data.status || 'unknown';
  const currentPeriodEnd = data.current_period_end ? data.current_period_end * 1000 : null;

  // Safely access items array
  const amount = safeGetArrayItem(data.items?.data, 0, 'price.unit_amount', 0);
  const interval = safeGetArrayItem(data.items?.data, 0, 'price.recurring.interval', 'unknown');

  // Log what we're about to save for debugging
  console.log(`📊 Subscription data to save:`, {
    stripeSubscriptionId: data.id,
    stripeCustomerId,
    projectId,
    status,
    currentPeriodEnd,
    amount,
    interval
  });

  // Warn about missing critical data
  if (!stripeCustomerId) console.warn(`⚠️ Missing customer ID for subscription ${data.id}`);
  if (projectId === 'unknown') console.warn(`⚠️ Missing projectId for subscription ${data.id}`);
  if (amount === 0) console.warn(`⚠️ Missing or zero amount for subscription ${data.id}`);

  await db
    .collection("subscriptions")
    .doc(data.id)
    .set({
      stripeCustomerId,
      projectId,
      stripeSubscriptionId: data.id,
      status,
      currentPeriodEnd,
      amount,
      interval,
      createdAt: Date.now(),
    });

  console.log(`✅ Subscription ${data.id} saved to Firestore`);
}

async function handleSubscriptionUpdated(data: any, eventId: string) {
  console.log(`📋 Processing subscription update for ${data.id}`);

  const updates: any = {
    status: data.status || 'unknown',
    currentPeriodEnd: data.current_period_end ? data.current_period_end * 1000 : null,
    updatedAt: Date.now(),
  };

  if (data.status === "canceled" || data.cancel_at_period_end) {
    updates.canceledAt = Date.now();
  }

  console.log(`📊 Subscription update data:`, updates);

  await db
    .collection("subscriptions")
    .doc(data.id)
    .set(updates, { merge: true });

  console.log(`✅ Subscription ${data.id} updated in Firestore`);
}

async function handleInvoicePaymentSucceeded(data: any, eventId: string) {
  console.log(`💳 Processing invoice payment for ${data.id}`);

  const subscriptionId = data.subscription;
  if (!subscriptionId) {
    console.warn(`⚠️ No subscription ID found for invoice ${data.id}`);
    return;
  }

  const updateData = {
    latestInvoice: data.id,
    lastPaymentAt: safeGet(data, 'status_transitions.paid_at')
      ? safeGet(data, 'status_transitions.paid_at') * 1000
      : Date.now(),
  };

  console.log(`📊 Invoice payment data:`, updateData);

  await db
    .collection("subscriptions")
    .doc(subscriptionId)
    .set(updateData, { merge: true });

  console.log(`✅ Invoice payment ${data.id} updated subscription ${subscriptionId}`);
}

async function handlePaymentIntentSucceeded(data: any, eventId: string) {
  console.log(`💰 Processing payment intent for ${data.id}`);

  const stripeCustomerId = data.customer || null;
  const projectId = safeGet(data, 'metadata.projectId', 'unknown');
  const amount = data.amount || 0;

  // Log what we're about to save
  console.log(`📊 Payment intent data:`, {
    stripePaymentIntentId: data.id,
    stripeCustomerId,
    projectId,
    amount
  });

  // Warn about missing data
  if (!stripeCustomerId) console.warn(`⚠️ Missing customer ID for payment ${data.id}`);
  if (projectId === 'unknown') console.warn(`⚠️ Missing projectId for payment ${data.id}`);

  await db.collection("payments").add({
    stripeCustomerId,
    projectId,
    stripePaymentIntentId: data.id,
    amount,
    createdAt: Date.now(),
  });

  console.log(`✅ Payment intent ${data.id} saved to Firestore`);
}
