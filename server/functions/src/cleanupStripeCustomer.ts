import { stripe } from "./firebaseConfig";
import { db, functions } from "./firebaseConfig";

export const cleanupStripeCustomer = functions
  .region("europe-west1")
  .auth.user()
  .onDelete(async (user) => {
    // 1. Obtener Stripe Customer ID
    const custSnap = await db.doc(`stripeCustomers/${user.uid}`).get();
    const stripeCustomerId = custSnap.data()?.stripeCustomerId;
    if (stripeCustomerId) {
      // 2. Borrar cliente en Stripe
      await stripe.customers.del(stripeCustomerId);
    }

    // 3. Eliminar suscripciones
    const subsSnap = await db
      .collection("subscriptions")
      .where("stripeCustomerId", "==", stripeCustomerId)
      .get();
    subsSnap.forEach((doc) => doc.ref.delete()); //

    // 4. Eliminar pagos únicos
    const paysSnap = await db
      .collection("payments")
      .where("stripeCustomerId", "==", stripeCustomerId)
      .get();
    paysSnap.forEach((doc) => doc.ref.delete());
  });
