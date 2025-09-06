import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  startProductCheckout,
  fetchCheckoutSession,
  fetchStripeProducts,
  openCustomerPortal,
} from "./stripeService";
import {
  createCheckoutSession,
  createCustomerPortal,
  getCheckoutSessionDetails,
  listStripeProducts,
} from "../repository/stripeRepository";
import { loadStripe } from "@stripe/stripe-js";

vi.mock("../repository/stripeRepository", () => ({
  createCheckoutSession: vi.fn(),
  createCustomerPortal: vi.fn(),
  getCheckoutSessionDetails: vi.fn(),
  listStripeProducts: vi.fn(),
}));

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn(),
}));

// Mock window.location
Object.defineProperty(window, "location", {
  value: {
    origin: "http://localhost:3000",
    assign: vi.fn(),
  },
  writable: true,
});

describe("startProductCheckout", () => {
  const priceId = "price_test123";
  const projectId = "project_test456";
  const mode = "subscription" as const;

  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let mockStripe: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockStripe = {
      redirectToCheckout: vi.fn(),
    };
  });

  it("should create checkout session and redirect successfully", async () => {
    const sessionData = { sessionId: "cs_test_session123" };
    const checkoutSessionResponse = { data: sessionData };

    vi.mocked(createCheckoutSession).mockResolvedValue(checkoutSessionResponse);
    vi.mocked(loadStripe).mockResolvedValue(mockStripe);
    mockStripe.redirectToCheckout.mockResolvedValue({ error: null });

    const result = await startProductCheckout(priceId, projectId, mode);

    expect(createCheckoutSession).toHaveBeenCalledWith({
      priceId,
      projectId,
      origin: window.location.origin,
      mode: mode,
    });
    expect(loadStripe).toHaveBeenCalledWith(
      "pk_test_51QhoysGAhUu396a0ioozYYafvj55TO6Uo8JuUXAAzlLu25XhlyQ6Vf5YAInIrGa0kJ9YszitKyfhKItUs9wBVBGY00s4OGn9Ym"
    );
    expect(mockStripe.redirectToCheckout).toHaveBeenCalledWith({
      sessionId: sessionData.sessionId,
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should handle Stripe initialization failure", async () => {
    const sessionData = { sessionId: "cs_test_session123" };
    const checkoutSessionResponse = { data: sessionData };

    vi.mocked(createCheckoutSession).mockResolvedValue(checkoutSessionResponse);
    vi.mocked(loadStripe).mockResolvedValue(null);

    await expect(
      startProductCheckout(priceId, projectId, mode)
    ).rejects.toThrow("No se pudo inicializar Stripe.js");

    expect(createCheckoutSession).toHaveBeenCalledWith({
      priceId,
      projectId,
      origin: window.location.origin,
      mode: mode,
    });
    expect(loadStripe).toHaveBeenCalled();
  });

  it("should handle Stripe checkout error", async () => {
    const data = { sessionId: "cs_test_session123" };
    const checkoutSessionResponse = { data: data };
    const stripeError = { message: "Payment method required" };

    vi.mocked(createCheckoutSession).mockResolvedValue(checkoutSessionResponse);
    vi.mocked(loadStripe).mockResolvedValue(mockStripe);
    mockStripe.redirectToCheckout.mockResolvedValue({ error: stripeError });

    const result = await startProductCheckout(priceId, projectId, mode);

    expect(createCheckoutSession).toHaveBeenCalledWith({
      priceId,
      projectId,
      origin: window.location.origin,
      mode: mode,
    });
    expect(loadStripe).toHaveBeenCalled();
    expect(mockStripe.redirectToCheckout).toHaveBeenCalledWith({
      sessionId: data.sessionId,
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error en Stripe Checkout:",
      stripeError.message
    );
    expect(result).toBeUndefined();
  });

  it("should work with payment mode", async () => {
    const paymentMode = "payment" as const;
    const data = { sessionId: "cs_test_session456" };
    const checkoutSessionResponse = { data };

    vi.mocked(createCheckoutSession).mockResolvedValue(checkoutSessionResponse);
    vi.mocked(loadStripe).mockResolvedValue(mockStripe);
    mockStripe.redirectToCheckout.mockResolvedValue({ error: null });

    const result = await startProductCheckout(priceId, projectId, paymentMode);

    expect(createCheckoutSession).toHaveBeenCalledWith({
      priceId,
      projectId,
      origin: window.location.origin,
      mode: paymentMode,
    });
    expect(loadStripe).toHaveBeenCalled();
    expect(mockStripe.redirectToCheckout).toHaveBeenCalledWith({
      sessionId: data.sessionId,
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});

describe("fetchCheckoutSession", () => {
  const sessionId = "cs_test_session123";
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should fetch checkout session details successfully", async () => {
    const data = {
      id: sessionId,
      object: "checkout.session" as const,
      amount_total: 2000,
      currency: "usd",
      payment_status: "paid" as const,
      customer_email: "test@example.com",
    } as any; // Using any to avoid complex Stripe.Session type
    const response = { data };

    vi.mocked(getCheckoutSessionDetails).mockResolvedValue(response);

    const result = await fetchCheckoutSession(sessionId);

    expect(getCheckoutSessionDetails).toHaveBeenCalledWith({ sessionId });
    expect(result).toEqual(data);
  });

  it("should handle repository errors", async () => {
    const error = new Error("Session not found");

    vi.mocked(getCheckoutSessionDetails).mockRejectedValue(error);

    const result = await fetchCheckoutSession(sessionId);
    expect(getCheckoutSessionDetails).toHaveBeenCalledWith({ sessionId });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Session not found: ", error);
    expect(result).toBeUndefined();
  });
});

describe("fetchStripeProducts", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should fetch Stripe products successfully", async () => {
    const products = {
      products: [
        {
          productId: "prod_test123",
          name: "Test Product 1",
          description: "Test product description",
          prices: [
            {
              priceId: "price_test123",
              amount: 1000,
              currency: "usd",
              recurring: null,
              type: "one_time" as const,
            },
          ],
        },
        {
          productId: "prod_test456",
          name: "Test Product 2",
          description: "Another test product",
          prices: [
            {
              priceId: "price_test456",
              amount: 2000,
              currency: "usd",
              recurring: {
                interval: "month" as const,
                interval_count: 1,
              },
              type: "recurring" as const,
            },
          ],
        },
      ],
    };
    const response = { data: products };

    vi.mocked(listStripeProducts).mockResolvedValue(response);

    const result = await fetchStripeProducts();

    expect(listStripeProducts).toHaveBeenCalled();
    expect(result).toEqual(products);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle errors correctly", async () => {
    const error = new Error("Failed to fetch products");

    vi.mocked(listStripeProducts).mockRejectedValue(error);

    const result = await fetchStripeProducts();
    expect(listStripeProducts).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching stripe products: ",
      error
    );
    expect(result).toBeUndefined();
  });
});

describe("openCustomerPortal", () => {
  const returnUrl = window.location.origin;

  let windowLocationAssignSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    windowLocationAssignSpy = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should open customer portal successfully", async () => {
    const portalUrl = "https://billing.stripe.com/session/test123";
    const portalResponse = { data: { url: portalUrl } };

    vi.mocked(createCustomerPortal).mockResolvedValue(portalResponse);

    const result = await openCustomerPortal();

    expect(createCustomerPortal).toHaveBeenCalledWith({
      returnUrl,
    });
    expect(windowLocationAssignSpy).toHaveBeenCalledWith(
      portalResponse.data.url
    );
    expect(result).toBeUndefined();
  });

  it("should handle repository errors", async () => {
    const error = new Error("Customer not found");

    vi.mocked(createCustomerPortal).mockRejectedValue(error);

    const result = await openCustomerPortal();
    expect(createCustomerPortal).toHaveBeenCalledWith({
      returnUrl,
    });
    expect(windowLocationAssignSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error creating customer portal: ",
      error
    );
  });
});
