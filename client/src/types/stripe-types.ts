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
