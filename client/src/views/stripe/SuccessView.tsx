import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchCheckoutSession } from "@/services/stripe/service/stripeService";
import Stripe from "stripe";

export const SuccessView = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const sessionId = params.get("session_id");

  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    // Llama a tu backend o Stripe API (mediante callable) para recuperar detalles
    fetchCheckoutSession(sessionId).then((data) => {
      setSession(data);
      setLoading(false);
    });
  }, [sessionId]);

  if (!sessionId) {
    return <p>Falta el identificador de sesión.</p>;
  }
  if (loading) {
    return <p>Cargando detalles de compra…</p>;
  }

  return (
    <div>
      <h1>¡Pago realizado con éxito!</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};
