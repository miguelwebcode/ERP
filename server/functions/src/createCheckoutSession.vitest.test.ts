import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { createCheckoutSession } from "./createCheckoutSession";
import { stripe, db, functions } from "./firebaseConfig";
import { CheckoutSessionData, CheckoutSessionResponse } from "./types";

// Mock de Firebase Config
vi.mock("./firebaseConfig", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
  db: {
    doc: vi.fn(),
  },
  functions: {
    region: vi.fn(() => ({
      https: {
        onCall: vi.fn((handler) => ({ _handler: handler })),
        HttpsError: vi.fn(),
      },
    })),
    https: {
      HttpsError: class {
        constructor(public code: string, public message: string) {}
      },
    },
  },
}));

describe("createCheckoutSession", () => {
  let mockDoc: Mock;
  let mockGet: Mock;
  let mockStripeCheckoutCreate: Mock;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const mockContext = {
    auth: {
      uid: "test-uid-123",
    },
  };

  const mockCheckoutData: CheckoutSessionData = {
    priceId: "price_test123",
    projectId: "project_test456",
    origin: "https://example.com",
    mode: "subscription",
  };

  const mockCustomerDoc = {
    data: () => ({
      stripeCustomerId: "cus_test123",
    }),
  };

  const mockStripeSession = {
    id: "cs_test123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");

    // Setup Firebase mocks
    mockGet = vi.fn();
    mockDoc = vi.mocked(db.doc);

    // Setup Stripe mocks
    mockStripeCheckoutCreate = vi.mocked(stripe.checkout.sessions.create);

    // Configure mock chains
    mockDoc.mockReturnValue({ get: mockGet } as any);
  });

  it("should create checkout session for subscription successfully", async () => {
    // Arrange
    mockGet.mockResolvedValue(mockCustomerDoc);
    mockStripeCheckoutCreate.mockResolvedValue(mockStripeSession as any);

    // Act - Get the handler function and call it
    const handler = (createCheckoutSession as any)._handler;
    const result = await handler(mockCheckoutData, mockContext);

    // Assert
    expect(mockDoc).toHaveBeenCalledWith("stripeCustomers/test-uid-123");
    expect(mockGet).toHaveBeenCalled();
    
    expect(mockStripeCheckoutCreate).toHaveBeenCalledWith({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: "cus_test123",
      line_items: [{ price: "price_test123", quantity: 1 }],
      success_url: "https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://example.com/cancel",
      client_reference_id: "project_test456",
      subscription_data: {
        metadata: { projectId: "project_test456" },
      },
    });

    const expected: CheckoutSessionResponse = { sessionId: "cs_test123" };
    expect(result).toEqual(expected);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should create checkout session for payment successfully", async () => {
    // Arrange
    const paymentData: CheckoutSessionData = {
      ...mockCheckoutData,
      mode: "payment",
    };
    mockGet.mockResolvedValue(mockCustomerDoc);
    mockStripeCheckoutCreate.mockResolvedValue(mockStripeSession as any);

    // Act
    const handler = (createCheckoutSession as any)._handler;
    const result = await handler(paymentData, mockContext);

    // Assert
    expect(mockStripeCheckoutCreate).toHaveBeenCalledWith({
      mode: "payment",
      payment_method_types: ["card"],
      customer: "cus_test123",
      line_items: [{ price: "price_test123", quantity: 1 }],
      success_url: "https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://example.com/cancel",
      client_reference_id: "project_test456",
      payment_intent_data: {
        metadata: { projectId: "project_test456" },
      },
    });

    const expected: CheckoutSessionResponse = { sessionId: "cs_test123" };
    expect(result).toEqual(expected);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should throw error when user is not authenticated", async () => {
    // Arrange
    const unauthenticatedContext = { auth: null };

    // Act & Assert
    const handler = (createCheckoutSession as any)._handler;
    await expect(
      handler(mockCheckoutData, unauthenticatedContext)
    ).rejects.toThrow("Authentication required.");
  });

  it("should handle missing customer document", async () => {
    // Arrange
    const mockEmptyDoc = {
      data: () => ({}),
    };
    mockGet.mockResolvedValue(mockEmptyDoc);
    mockStripeCheckoutCreate.mockResolvedValue(mockStripeSession as any);

    // Act
    const handler = (createCheckoutSession as any)._handler;
    const result = await handler(mockCheckoutData, mockContext);

    // Assert
    expect(mockStripeCheckoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: undefined,
      })
    );
    expect(result).toEqual({ sessionId: "cs_test123" });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle database error when getting customer", async () => {
    // Arrange
    const error = new Error("Database error");
    mockGet.mockRejectedValue(error);

    // Act & Assert
    const handler = (createCheckoutSession as any)._handler;
    await expect(
      handler(mockCheckoutData, mockContext)
    ).rejects.toThrow("Database error");
    
    expect(mockDoc).toHaveBeenCalledWith("stripeCustomers/test-uid-123");
    expect(mockStripeCheckoutCreate).not.toHaveBeenCalled();
  });

  it("should handle stripe session creation error", async () => {
    // Arrange
    mockGet.mockResolvedValue(mockCustomerDoc);
    const stripeError = new Error("Stripe error");
    mockStripeCheckoutCreate.mockRejectedValue(stripeError);

    // Act & Assert
    const handler = (createCheckoutSession as any)._handler;
    await expect(
      handler(mockCheckoutData, mockContext)
    ).rejects.toThrow("Stripe error");
    
    expect(mockStripeCheckoutCreate).toHaveBeenCalled();
  });

  it("should handle context without auth uid", async () => {
    // Arrange
    const contextWithoutUid = {
      auth: {},
    };

    // Act & Assert
    const handler = (createCheckoutSession as any)._handler;
    await expect(
      handler(mockCheckoutData, contextWithoutUid)
    ).rejects.toThrow("Authentication required.");
  });
});
