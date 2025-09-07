import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { createStripeCustomer } from "./createStripeCustomer";
import { stripe, db } from "./firebaseConfig";

// Mock de Firebase Admin
vi.mock("firebase-admin", () => ({
  firestore: {
    FieldValue: {
      serverTimestamp: vi.fn(() => "server-timestamp"),
    },
  },
}));

// Mock de Firebase Config
vi.mock("./firebaseConfig", () => ({
  stripe: {
    customers: {
      create: vi.fn(),
    },
  },
  db: {
    doc: vi.fn(),
  },
  functions: {
    region: vi.fn(() => ({
      auth: {
        user: vi.fn(() => ({
          onCreate: vi.fn((handler) => ({ _handler: handler })),
        })),
      },
    })),
  },
}));

describe("createStripeCustomer", () => {
  let mockDoc: Mock;
  let mockSet: Mock;
  let mockStripeCustomersCreate: Mock;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const mockUser = {
    uid: "test-uid-123",
    email: "test@example.com",
  };

  const mockStripeCustomer = {
    id: "cus_test123",
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");

    // Setup Firebase mocks
    mockSet = vi.fn();
    mockDoc = vi.mocked(db.doc);

    // Setup Stripe mocks
    mockStripeCustomersCreate = vi.mocked(stripe.customers.create);

    // Configure mock chains
    mockDoc.mockReturnValue({ set: mockSet } as any);
  });

  it("should create stripe customer successfully", async () => {
    // Arrange
    mockStripeCustomersCreate.mockResolvedValue(mockStripeCustomer as any);
    mockSet.mockResolvedValue(undefined);

    // Act - Get the handler function and call it
    const handler = (createStripeCustomer as any)._handler;
    await handler(mockUser);

    // Assert
    expect(mockStripeCustomersCreate).toHaveBeenCalledWith({
      email: "test@example.com",
      metadata: { firebaseUID: "test-uid-123" },
    });

    expect(mockDoc).toHaveBeenCalledWith("stripeCustomers/test-uid-123");
    expect(mockSet).toHaveBeenCalledWith({
      stripeCustomerId: "cus_test123",
      email: "test@example.com",
      createdAt: "server-timestamp",
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle stripe customer creation error", async () => {
    // Arrange
    const stripeError = new Error("Stripe API error");
    mockStripeCustomersCreate.mockRejectedValue(stripeError);

    // Act & Assert
    const handler = (createStripeCustomer as any)._handler;
    await expect(handler(mockUser)).rejects.toThrow("Stripe API error");

    expect(mockStripeCustomersCreate).toHaveBeenCalledWith({
      email: "test@example.com",
      metadata: { firebaseUID: "test-uid-123" },
    });

    expect(mockDoc).not.toHaveBeenCalled();
    expect(mockSet).not.toHaveBeenCalled();
  });

  it("should handle database save error", async () => {
    // Arrange
    mockStripeCustomersCreate.mockResolvedValue(mockStripeCustomer as any);
    const dbError = new Error("Database error");
    mockSet.mockRejectedValue(dbError);

    // Act & Assert
    const handler = (createStripeCustomer as any)._handler;
    await expect(handler(mockUser)).rejects.toThrow("Database error");

    expect(mockStripeCustomersCreate).toHaveBeenCalled();
    expect(mockDoc).toHaveBeenCalledWith("stripeCustomers/test-uid-123");
    expect(mockSet).toHaveBeenCalled();
  });

  it("should handle missing email", async () => {
    // Arrange
    const userWithoutEmail = {
      uid: "test-uid-123",
      email: null,
    };

    // This should pass through to Stripe which will handle the validation
    const stripeError = new Error("Email is required");
    mockStripeCustomersCreate.mockRejectedValue(stripeError);

    // Act & Assert
    const handler = (createStripeCustomer as any)._handler;
    await expect(handler(userWithoutEmail)).rejects.toThrow("Email is required");

    expect(mockStripeCustomersCreate).toHaveBeenCalledWith({
      email: null,
      metadata: { firebaseUID: "test-uid-123" },
    });
  });

  it("should handle user with empty uid", async () => {
    // Arrange
    const userWithoutUid = {
      uid: "",
      email: "test@example.com",
    };
    
    mockStripeCustomersCreate.mockResolvedValue(mockStripeCustomer as any);
    mockSet.mockResolvedValue(undefined);

    // Act
    const handler = (createStripeCustomer as any)._handler;
    await handler(userWithoutUid);

    // Assert
    expect(mockDoc).toHaveBeenCalledWith("stripeCustomers/");
    expect(mockSet).toHaveBeenCalled();
  });
});
