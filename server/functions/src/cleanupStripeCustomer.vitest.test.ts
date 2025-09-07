import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { cleanupStripeCustomer } from "./cleanupStripeCustomer";
import { stripe, db } from "./firebaseConfig";

// Mock de Firebase Config
vi.mock("./firebaseConfig", () => ({
  stripe: {
    customers: {
      del: vi.fn(),
    },
  },
  db: {
    doc: vi.fn(),
    collection: vi.fn(),
  },
  functions: {
    region: vi.fn(() => ({
      auth: {
        user: vi.fn(() => ({
          onDelete: vi.fn((handler) => ({ _handler: handler })),
        })),
      },
    })),
  },
}));

describe("cleanupStripeCustomer", () => {
  let mockDoc: Mock;
  let mockCollection: Mock;
  let mockGet: Mock;
  let mockWhere: Mock;
  let mockQueryGet: Mock;
  let mockStripeCustomersDel: Mock;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const mockUser = {
    uid: "test-uid-123",
  };

  const mockStripeCustomerDoc = {
    data: () => ({
      stripeCustomerId: "cus_test123",
    }),
  };

  const mockSubscriptionDocs = [
    {
      ref: {
        delete: vi.fn(),
      },
    },
    {
      ref: {
        delete: vi.fn(),
      },
    },
  ];

  const mockPaymentDocs = [
    {
      ref: {
        delete: vi.fn(),
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");

    // Setup Firebase mocks
    mockGet = vi.fn();
    mockDoc = vi.mocked(db.doc);
    mockCollection = vi.mocked(db.collection);
    mockWhere = vi.fn();
    mockQueryGet = vi.fn();

    // Setup Stripe mocks
    mockStripeCustomersDel = vi.mocked(stripe.customers.del);

    // Configure mock chains
    mockDoc.mockReturnValue({ get: mockGet } as any);
    mockCollection.mockReturnValue({ where: mockWhere } as any);
    mockWhere.mockReturnValue({ get: mockQueryGet } as any);
  });

  it("should cleanup stripe customer and related data successfully", async () => {
    // Arrange
    mockGet.mockResolvedValue(mockStripeCustomerDoc);
    mockQueryGet.mockResolvedValueOnce({
      forEach: (callback: (doc: any) => void) => {
        mockSubscriptionDocs.forEach(callback);
      },
    });
    mockQueryGet.mockResolvedValueOnce({
      forEach: (callback: (doc: any) => void) => {
        mockPaymentDocs.forEach(callback);
      },
    });

    // Act - Get the handler function from cleanupStripeCustomer and call it
    const handler = (cleanupStripeCustomer as any)._handler;
    await handler(mockUser);

    // Assert
    expect(mockDoc).toHaveBeenCalledWith("stripeCustomers/test-uid-123");
    expect(mockGet).toHaveBeenCalled();
    expect(mockStripeCustomersDel).toHaveBeenCalledWith("cus_test123");

    expect(mockCollection).toHaveBeenCalledWith("subscriptions");
    expect(mockWhere).toHaveBeenCalledWith(
      "stripeCustomerId",
      "==",
      "cus_test123"
    );

    expect(mockCollection).toHaveBeenCalledWith("payments");
    expect(mockWhere).toHaveBeenCalledWith(
      "stripeCustomerId",
      "==",
      "cus_test123"
    );

    // Verify subscription docs were deleted
    mockSubscriptionDocs.forEach((doc) => {
      expect(doc.ref.delete).toHaveBeenCalled();
    });

    // Verify payment docs were deleted
    mockPaymentDocs.forEach((doc) => {
      expect(doc.ref.delete).toHaveBeenCalled();
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle missing stripe customer ID gracefully", async () => {
    // Arrange
    const mockEmptyDoc = {
      data: () => ({}),
    };
    mockGet.mockResolvedValue(mockEmptyDoc);
    mockQueryGet.mockResolvedValue({
      forEach: vi.fn(),
    });

    // Act
    const handler = (cleanupStripeCustomer as any)._handler;
    await handler(mockUser);

    // Assert
    expect(mockDoc).toHaveBeenCalledWith("stripeCustomers/test-uid-123");
    expect(mockGet).toHaveBeenCalled();
    expect(mockStripeCustomersDel).not.toHaveBeenCalled();

    // Should still try to cleanup subscriptions and payments with undefined stripeCustomerId
    expect(mockCollection).toHaveBeenCalledWith("subscriptions");
    expect(mockWhere).toHaveBeenCalledWith("stripeCustomerId", "==", undefined);
    expect(mockCollection).toHaveBeenCalledWith("payments");
    expect(mockWhere).toHaveBeenCalledWith("stripeCustomerId", "==", undefined);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle stripe customer deletion error", async () => {
    // Arrange
    const error = new Error("Stripe error");
    mockGet.mockResolvedValue(mockStripeCustomerDoc);
    mockStripeCustomersDel.mockRejectedValue(error);

    // Act & Assert
    const handler = (cleanupStripeCustomer as any)._handler;
    const result = await handler(mockUser);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error cleaning up Stripe customer data:",
      error
    );
    expect(result).toBeUndefined();
  });

  it("should handle database error when getting customer doc", async () => {
    // Arrange
    const error = new Error("Database error");
    mockGet.mockRejectedValue(error);

    // Act & Assert
    const handler = (cleanupStripeCustomer as any)._handler;
    const result = await handler(mockUser);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error cleaning up Stripe customer data:",
      error
    );

    expect(mockDoc).toHaveBeenCalledWith("stripeCustomers/test-uid-123");
    expect(mockStripeCustomersDel).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should handle empty subscriptions and payments collections", async () => {
    // Arrange
    mockGet.mockResolvedValue(mockStripeCustomerDoc);
    mockQueryGet.mockResolvedValue({
      forEach: vi.fn(), // Empty collections
    });

    // Act
    const handler = (cleanupStripeCustomer as any)._handler;
    await handler(mockUser);

    // Assert
    expect(mockStripeCustomersDel).toHaveBeenCalledWith("cus_test123");
    expect(mockCollection).toHaveBeenCalledWith("subscriptions");
    expect(mockCollection).toHaveBeenCalledWith("payments");
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
