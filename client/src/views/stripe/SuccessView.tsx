import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchCheckoutSession } from "@/services/stripe/service/stripeService";
import Stripe from "stripe";
import { formatCurrency } from "@/lib/utils";

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
      setSession(data as Stripe.Checkout.Session);
      setLoading(false);
    });
  }, [sessionId]);

  if (!sessionId) {
    return <p>Session ID is missing.</p>;
  }
  if (loading) {
    return <p>Loading purchase details…</p>;
  }

  const customerName = session!.customer_details?.name ?? "Customer";
  // const customerEmail = session!.customer_details?.email ?? "";
  const lineItem = session!.line_items?.data[0];
  const productDesc = lineItem?.description ?? "Your purchase";
  const priceInfo = lineItem?.price;
  const amountPaid = priceInfo ? priceInfo.unit_amount! / 100 : 0;
  const currency = priceInfo?.currency.toUpperCase() ?? "";
  const recurrence =
    session!.mode === "subscription"
      ? `${priceInfo?.recurring?.interval}`
      : "One-time payment";
  // const subscriptionId = (session!.subscription as string) ?? "";
  const createdDate = new Date(session!.created! * 1000).toLocaleDateString();

  return (
    <div className="mx-auto max-w-lg p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Successful Payment!</h1>
      <p className="mb-2">
        Thank you, <strong>{customerName}</strong>.
      </p>
      {/* {customerEmail && (
        <p className="mb-4">
          We have sent an email to <strong>{customerEmail}</strong>.
        </p>
      )} */}

      <div className="border-t pt-4 mb-4">
        <h2 className="text-xl font-semibold">Purchase Details</h2>
        <ul className="mt-2 space-y-2">
          <li>
            <strong>Product:</strong> {productDesc}
          </li>
          <li>
            <strong>Amount:</strong>{" "}
            {formatCurrency(amountPaid, currency, "es-ES")}
          </li>
          <li>
            <strong>Type:</strong> {recurrence}
          </li>
          {/* {subscriptionId && (
            <li>
              <strong>Subscription ID:</strong> {subscriptionId}
            </li>
          )} */}
          <li>
            <strong>Date:</strong> {createdDate}
          </li>
        </ul>
      </div>

      <button
        onClick={() => (window.location.href = "/")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Return to Dashboard
      </button>
    </div>
  );
};
