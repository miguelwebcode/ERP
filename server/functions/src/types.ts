export type CheckoutSessionData = {
  priceId: string;
  projectId: string;
  origin: string; // URL de la app para redirección
  mode?: "subscription" | "payment";
};

export type CheckoutSessionResponse = {
  sessionId: string;
};
