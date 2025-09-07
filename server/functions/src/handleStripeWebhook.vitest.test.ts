import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { stripeWebhook } from "./handleStripeWebhook";
import { stripe, db, webhookSecret } from "./firebaseConfig";
import * as admin from "firebase-admin";

// Mock de Firebase Functions
vi.mock("firebase-functions/v1", () => ({
  region: vi.fn(() => ({
    https: {
      onRequest: vi.fn((handler) => ({ _handler: handler })),
    },
  })),
}));

// Mock de Firebase Config
vi.mock("./firebaseConfig", () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
  db: {
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({
        set: vi.fn(),
      })),
      add: vi.fn(),
    })),
  },
  webhookSecret: "whsec_test123",
}));

// Mock de Firebase Admin
vi.mock("firebase-admin", () => ({
  firestore: {
    Timestamp: {
      now: vi.fn(() => ({
        toMillis: vi.fn(() => 1640995200000),
      })),
    },
  },
}));

describe("stripeWebhook", () => {
  let mockConstructEvent: Mock;
  let mockCollection: Mock;
  let mockDoc: Mock;
  let mockSet: Mock;
  let mockAdd: Mock;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  const mockReq = {
    headers: {
      "stripe-signature": "t=1234567890,v1=test_signature",
    },
    rawBody: Buffer.from("test"),
  };

  const mockRes = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
    json: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    consoleLogSpy = vi.spyOn(console, "log");

    // Setup Firebase mocks
    mockCollection = vi.mocked(db.collection);
    mockDoc = vi.fn(() => ({
      set: vi.fn(),
    }));
    mockSet = vi.fn();
    mockAdd = vi.fn();

    mockCollection.mockReturnValue({
      doc: mockDoc,
      add: mockAdd,
    } as any);

    mockDoc.mockReturnValue({
      set: mockSet,
    } as any);

    // Setup Stripe mocks
    mockConstructEvent = vi.mocked(stripe.webhooks.constructEvent);
  });

  it("should handle customer.subscription.created event", async () => {
    // Arrange
    const mockEvent = {
      type: "customer.subscription.created",
      data: {
        object: {
          id: "sub_test123",
          customer: "cus_test123",
          metadata: {
            projectId: "proj_test123",
          },
          status: "active",
          current_period_end: 1672531200,
          items: {
            data: [
              {
                price: {
                  unit_amount: 1000,
                  recurring: {
                    interval: "month",
                  },
                },
              },
            ],
          },
        },
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);

    // Act
    const handler = (stripeWebhook as any)._handler;
    await handler(mockReq, mockRes);

    // Assert
    expect(mockConstructEvent).toHaveBeenCalledWith(
      mockReq.rawBody,
      mockReq.headers["stripe-signature"],
      webhookSecret
    );

    expect(mockCollection).toHaveBeenCalledWith("subscriptions");
    expect(mockDoc).toHaveBeenCalledWith("sub_test123");
    expect(mockSet).toHaveBeenCalledWith({
      stripeCustomerId: "cus_test123",
      projectId: "proj_test123",
      stripeSubscriptionId: "sub_test123",
      status: "active",
      currentPeriodEnd: 1672531200000,
      amount: 1000,
      interval: "month",
      createdAt: 1640995200000,
    });

    expect(consoleLogSpy).toHaveBeenCalledWith("✅ Webhook validado:", "customer.subscription.created");
    expect(mockRes.json).toHaveBeenCalledWith({ received: true });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle customer.subscription.updated event", async () => {
    // Arrange
    const mockEvent = {
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_test123",
          status: "past_due",
          current_period_end: 1672531200,
          cancel_at_period_end: false,
        },
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);

    // Act
    const handler = (stripeWebhook as any)._handler;
    await handler(mockReq, mockRes);

    // Assert
    expect(mockConstructEvent).toHaveBeenCalledWith(
      mockReq.rawBody,
      mockReq.headers["stripe-signature"],
      webhookSecret
    );

    expect(mockCollection).toHaveBeenCalledWith("subscriptions");
    expect(mockDoc).toHaveBeenCalledWith("sub_test123");
    expect(mockSet).toHaveBeenCalledWith(
      {
        status: "past_due",
        currentPeriodEnd: 1672531200000,
        updatedAt: 1640995200000,
      },
      { merge: true }
    );

    expect(consoleLogSpy).toHaveBeenCalledWith("✅ Webhook validado:", "customer.subscription.updated");
    expect(mockRes.json).toHaveBeenCalledWith({ received: true });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle customer.subscription.updated event with cancellation", async () => {
    // Arrange
    const mockEvent = {
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_test123",
          status: "canceled",
          current_period_end: 1672531200,
          cancel_at_period_end: true,
        },
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);

    // Act
    const handler = (stripeWebhook as any)._handler;
    await handler(mockReq, mockRes);

    // Assert
    expect(mockSet).toHaveBeenCalledWith(
      {
        status: "canceled",
        currentPeriodEnd: 1672531200000,
        updatedAt: 1640995200000,
        canceledAt: 1640995200000,
      },
      { merge: true }
    );

    expect(mockRes.json).toHaveBeenCalledWith({ received: true });
  });

  it("should handle invoice.payment_succeeded event", async () => {
    // Arrange
    const mockEvent = {
      type: "invoice.payment_succeeded",
      data: {
        object: {
          id: "in_test123",
          subscription: "sub_test123",
          status_transitions: {
            paid_at: 1640995200,
          },
        },
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);

    // Act
    const handler = (stripeWebhook as any)._handler;
    await handler(mockReq, mockRes);

    // Assert
    expect(mockConstructEvent).toHaveBeenCalledWith(
      mockReq.rawBody,
      mockReq.headers["stripe-signature"],
      webhookSecret
    );

    expect(mockCollection).toHaveBeenCalledWith("subscriptions");
    expect(mockDoc).toHaveBeenCalledWith("sub_test123");
    expect(mockSet).toHaveBeenCalledWith(
      {
        latestInvoice: "in_test123",
        lastPaymentAt: 1640995200000,
      },
      { merge: true }
    );

    expect(consoleLogSpy).toHaveBeenCalledWith("✅ Webhook validado:", "invoice.payment_succeeded");
    expect(mockRes.json).toHaveBeenCalledWith({ received: true });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle payment_intent.succeeded event", async () => {
    // Arrange
    const mockEvent = {
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_test123",
          customer: "cus_test123",
          metadata: {
            projectId: "proj_test123",
          },
          amount: 2000,
        },
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);

    // Act
    const handler = (stripeWebhook as any)._handler;
    await handler(mockReq, mockRes);

    // Assert
    expect(mockConstructEvent).toHaveBeenCalledWith(
      mockReq.rawBody,
      mockReq.headers["stripe-signature"],
      webhookSecret
    );

    expect(mockCollection).toHaveBeenCalledWith("payments");
    expect(mockAdd).toHaveBeenCalledWith({
      stripeCustomerId: "cus_test123",
      projectId: "proj_test123",
      stripePaymentIntentId: "pi_test123",
      amount: 2000,
      createdAt: 1640995200000,
    });

    expect(consoleLogSpy).toHaveBeenCalledWith("✅ Webhook validado:", "payment_intent.succeeded");
    expect(mockRes.json).toHaveBeenCalledWith({ received: true });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle unhandled event types", async () => {
    // Arrange
    const mockEvent = {
      type: "customer.created",
      data: {
        object: {
          id: "cus_test123",
        },
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);

    // Act
    const handler = (stripeWebhook as any)._handler;
    await handler(mockReq, mockRes);

    // Assert
    expect(mockConstructEvent).toHaveBeenCalledWith(
      mockReq.rawBody,
      mockReq.headers["stripe-signature"],
      webhookSecret
    );

    expect(consoleLogSpy).toHaveBeenCalledWith("✅ Webhook validado:", "customer.created");
    expect(consoleLogSpy).toHaveBeenCalledWith("Unhandled event type customer.created");
    expect(mockRes.json).toHaveBeenCalledWith({ received: true });
    expect(mockCollection).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle invalid webhook signature", async () => {
    // Arrange
    const signatureError = new Error("Invalid signature");
    mockConstructEvent.mockImplementation(() => {
      throw signatureError;
    });

    // Act
    const handler = (stripeWebhook as any)._handler;
    await handler(mockReq, mockRes);

    // Assert
    expect(mockConstructEvent).toHaveBeenCalledWith(
      mockReq.rawBody,
      mockReq.headers["stripe-signature"],
      webhookSecret
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith("❌ Firma inválida:", "Invalid signature");
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith("Webhook Error: Invalid signature");
    expect(mockRes.json).not.toHaveBeenCalled();
    expect(mockCollection).not.toHaveBeenCalled();
  });

  it("should handle invoice.payment_succeeded without status_transitions", async () => {
    // Arrange
    const mockEvent = {
      type: "invoice.payment_succeeded",
      data: {
        object: {
          id: "in_test123",
          subscription: "sub_test123",
          status_transitions: null,
        },
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);

    // Act
    const handler = (stripeWebhook as any)._handler;
    await handler(mockReq, mockRes);

    // Assert
    expect(mockSet).toHaveBeenCalledWith(
      {
        latestInvoice: "in_test123",
        lastPaymentAt: undefined,
      },
      { merge: true }
    );

    expect(mockRes.json).toHaveBeenCalledWith({ received: true });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle subscription.updated without cancel_at_period_end", async () => {
    // Arrange
    const mockEvent = {
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_test123",
          status: "active",
          current_period_end: 1672531200,
          // No cancel_at_period_end field
        },
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);

    // Act
    const handler = (stripeWebhook as any)._handler;
    await handler(mockReq, mockRes);

    // Assert
    expect(mockSet).toHaveBeenCalledWith(
      {
        status: "active",
        currentPeriodEnd: 1672531200000,
        updatedAt: 1640995200000,
        // Should not include canceledAt
      },
      { merge: true }
    );

    expect(mockRes.json).toHaveBeenCalledWith({ received: true });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
