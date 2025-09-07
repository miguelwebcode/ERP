import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { getCheckoutSessionDetails } from "./getCheckoutSessionDetails";
import { stripe, functions } from "./firebaseConfig";
import { CheckoutSessionDetailsData } from "./types";
import Stripe from "stripe";

// Mock de Firebase Config
vi.mock("./firebaseConfig", () => ({
  stripe: {
    checkout: {
      sessions: {
        retrieve: vi.fn(),
      },
    },
  },
  functions: {
    region: vi.fn(() => ({
      https: {
        onCall: vi.fn((handler) => ({ _handler: handler })),
      },
    })),
  },
}));

describe("getCheckoutSessionDetails", () => {
  let mockStripeCheckoutRetrieve: Mock;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const mockSessionData: CheckoutSessionDetailsData = {
    sessionId: "cs_test123",
  };

  const mockStripeSession: Stripe.Checkout.Session = {
    id: "cs_test123",
    object: "checkout.session",
    payment_status: "paid",
    status: "complete",
    url: "https://checkout.stripe.com/pay/cs_test123",
    customer: {
      id: "cus_test123",
      name: "Test Customer",
      email: "test@example.com",
    } as Stripe.Customer,
    line_items: {
      object: "list",
      data: [
        {
          id: "li_test123",
          object: "item",
          price: {
            id: "price_test123",
            object: "price",
            currency: "usd",
            unit_amount: 1000,
          } as Stripe.Price,
          quantity: 1,
        },
      ],
    } as Stripe.ApiList<Stripe.LineItem>,
  } as Stripe.Checkout.Session;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");

    // Setup Stripe mocks
    mockStripeCheckoutRetrieve = vi.mocked(stripe.checkout.sessions.retrieve);
  });

  it("should retrieve checkout session details successfully", async () => {
    // Arrange
    mockStripeCheckoutRetrieve.mockResolvedValue(mockStripeSession);

    // Act - Get the handler function and call it
    const handler = (getCheckoutSessionDetails as any)._handler;
    const result = await handler(mockSessionData);

    // Assert
    expect(mockStripeCheckoutRetrieve).toHaveBeenCalledWith("cs_test123", {
      expand: ["customer", "line_items"],
    });

    expect(result).toEqual(mockStripeSession);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle stripe API error", async () => {
    // Arrange
    const stripeError = new Error("Stripe API error");
    mockStripeCheckoutRetrieve.mockRejectedValue(stripeError);

    // Act & Assert
    const handler = (getCheckoutSessionDetails as any)._handler;
    await expect(handler(mockSessionData)).rejects.toThrow("Stripe API error");
    
    expect(mockStripeCheckoutRetrieve).toHaveBeenCalledWith("cs_test123", {
      expand: ["customer", "line_items"],
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error getting checkout session details: ", stripeError);
  });

  it("should handle invalid session ID", async () => {
    // Arrange
    const invalidData: CheckoutSessionDetailsData = {
      sessionId: "invalid_session_id",
    };
    const stripeError = new Error("No such checkout session");
    mockStripeCheckoutRetrieve.mockRejectedValue(stripeError);

    // Act & Assert
    const handler = (getCheckoutSessionDetails as any)._handler;
    await expect(handler(invalidData)).rejects.toThrow("No such checkout session");
    
    expect(mockStripeCheckoutRetrieve).toHaveBeenCalledWith("invalid_session_id", {
      expand: ["customer", "line_items"],
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error getting checkout session details: ", stripeError);
  });

  it("should handle empty session ID", async () => {
    // Arrange
    const emptyData: CheckoutSessionDetailsData = {
      sessionId: "",
    };
    const stripeError = new Error("Session ID is required");
    mockStripeCheckoutRetrieve.mockRejectedValue(stripeError);

    // Act & Assert
    const handler = (getCheckoutSessionDetails as any)._handler;
    await expect(handler(emptyData)).rejects.toThrow("Session ID is required");
    
    expect(mockStripeCheckoutRetrieve).toHaveBeenCalledWith("", {
      expand: ["customer", "line_items"],
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error getting checkout session details: ", stripeError);
  });

  it("should expand customer and line_items correctly", async () => {
    // Arrange
    const sessionWithExpandedData: Stripe.Checkout.Session = {
      ...mockStripeSession,
      customer: {
        id: "cus_test123",
        name: "Test Customer",
        email: "test@example.com",
        phone: "+1234567890",
      } as Stripe.Customer,
    };
    mockStripeCheckoutRetrieve.mockResolvedValue(sessionWithExpandedData);

    // Act
    const handler = (getCheckoutSessionDetails as any)._handler;
    const result = await handler(mockSessionData);

    // Assert
    expect(mockStripeCheckoutRetrieve).toHaveBeenCalledWith("cs_test123", {
      expand: ["customer", "line_items"],
    });
    
    expect(result.customer).toBeDefined();
    expect((result.customer as Stripe.Customer).email).toBe("test@example.com");
    expect(result.line_items).toBeDefined();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle network timeout error", async () => {
    // Arrange
    const timeoutError = new Error("Request timeout");
    mockStripeCheckoutRetrieve.mockRejectedValue(timeoutError);

    // Act & Assert
    const handler = (getCheckoutSessionDetails as any)._handler;
    await expect(handler(mockSessionData)).rejects.toThrow("Request timeout");
    
    expect(mockStripeCheckoutRetrieve).toHaveBeenCalledWith("cs_test123", {
      expand: ["customer", "line_items"],
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error getting checkout session details: ", timeoutError);
  });
});
