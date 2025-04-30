export type CheckoutSessionData = {
  priceId: string;
  projectId: string;
  origin: string; // URL de la app para redirección
  mode: "subscription" | "payment";
};

export type CheckoutSessionResponse = {
  sessionId: string;
};

export type CheckoutSessionDetailsData = {
  sessionId: string;
};

export type StripePriceDetails = {
  priceId: string;
  amount: number;
  currency: string;
  recurring: {
    interval: "day" | "week" | "month" | "year";
    interval_count: number;
  } | null;
  type: "one_time" | "recurring";
};

export type StripeProduct = {
  productId: string;
  name: string;
  description: string | null;
  prices: StripePriceDetails[];
};

export type ListStripeProductsResponse = {
  products: StripeProduct[];
};

export type CustomerPortalData = {
  returnUrl: string;
};

export type CustomerPortalResponse = {
  url: string;
};

export type Subscription = {
  createdAt: number;
  currentPeriodEnd: number;
  interval: "month" | "year";
  amount: number;
  latestInvoice: string;
  projectId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  canceledAt?: number;
  lastPaymentAt?: number;
  updatedAt?: number;
  status: string;
};

export type MrrMonth = {
  month: string;
  revenue: number;
};
