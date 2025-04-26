export type CheckoutSessionData = {
  priceId: string;
  projectId: string;
  origin: string;
  mode: "subscription" | "payment";
};

export type CheckoutSessionResponse = {
  sessionId: string;
};

export type CheckoutSessionDetailsData = {
  sessionId: string;
};
