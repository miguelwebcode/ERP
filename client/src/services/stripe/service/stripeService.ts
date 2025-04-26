import {
  createCheckoutSession,
  getCheckoutSessionDetails,
} from "../repository/stripeRepository";
import { loadStripe } from "@stripe/stripe-js";

export async function startSubscription(priceId: string, projectId: string) {
  const fn = createCheckoutSession;
  const { data } = await fn({
    priceId,
    projectId,
    origin: window.location.origin,
    mode: "subscription",
  });
  const stripe = await loadStripe(
    "pk_test_51QhoysGAhUu396a0ioozYYafvj55TO6Uo8JuUXAAzlLu25XhlyQ6Vf5YAInIrGa0kJ9YszitKyfhKItUs9wBVBGY00s4OGn9Ym"
  );

  if (!stripe) throw new Error("No se pudo inicializar Stripe.js");

  const { error } = await stripe.redirectToCheckout({
    sessionId: data.sessionId,
  });

  if (error) console.error("Error en Stripe Checkout:", error.message);
}

export async function fetchCheckoutSession(sessionId: string) {
  const { data } = await getCheckoutSessionDetails({ sessionId });
  return data;
}
