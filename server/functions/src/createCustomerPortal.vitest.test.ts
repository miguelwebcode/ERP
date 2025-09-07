import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { createCustomerPortal } from "./createCustomerPortal";
import { stripe, db, functions } from "./firebaseConfig";
import { CustomerPortalData, CustomerPortalResponse } from "./types";

// Mock de Firebase Config
vi.mock("./firebaseConfig", () => ({
  stripe: {
    billingPortal: {
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

describe("createCustomerPortal", () => {
  let mockDoc: Mock;
  let mockGet: Mock;
  let mockStripeBillingPortalCreate: Mock;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const mockContext = {
    auth: {
      uid: "test-uid-123",
    },
  };

  const mockPortalData: CustomerPortalData = {
    returnUrl: "https://example.com/dashboard",
  };

  const mockCustomerDoc = {
    data: () => ({
      stripeCustomerId: "cus_test123",
    }),
  };

  const mockBillingPortalSession = {
    url: "https://billing.stripe.com/session/test123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log");
    consoleErrorSpy = vi.spyOn(console, "error");

    // Setup Firebase mocks
    mockGet = vi.fn();
    mockDoc = vi.mocked(db.doc);

    // Setup Stripe mocks
    mockStripeBillingPortalCreate = vi.mocked(stripe.billingPortal.sessions.create);

    // Configure mock chains
    mockDoc.mockReturnValue({ get: mockGet } as any);
  });

  it("should create customer portal session successfully", async () => {
    // Arrange
    mockGet.mockResolvedValue(mockCustomerDoc);
    mockStripeBillingPortalCreate.mockResolvedValue(mockBillingPortalSession as any);

    // Act - Get the handler function and call it
    const handler = (createCustomerPortal as any)._handler;
    const result = await handler(mockPortalData, mockContext);

    // Assert
    expect(mockDoc).toHaveBeenCalledWith("stripeCustomers/test-uid-123");
    expect(mockGet).toHaveBeenCalled();
    
    expect(consoleLogSpy).toHaveBeenCalledWith("custDoc: ", mockCustomerDoc);
    expect(consoleLogSpy).toHaveBeenCalledWith("stripeCustomerId: ", "cus_test123");
    
    expect(mockStripeBillingPortalCreate).toHaveBeenCalledWith({
      customer: "cus_test123",
      return_url: "https://example.com/dashboard",
    });

    const expected: CustomerPortalResponse = { url: "https://billing.stripe.com/session/test123" };
    expect(result).toEqual(expected);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should throw error when user is not authenticated", async () => {
    // Arrange
    const unauthenticatedContext = { auth: null };

    // Act & Assert
    const handler = (createCustomerPortal as any)._handler;
    await expect(
      handler(mockPortalData, unauthenticatedContext)
    ).rejects.toThrow("Auth required.");
  });

  it("should handle missing customer document", async () => {
    // Arrange
    const mockEmptyDoc = {
      data: () => ({}),
    };
    mockGet.mockResolvedValue(mockEmptyDoc);
    mockStripeBillingPortalCreate.mockResolvedValue(mockBillingPortalSession as any);

    // Act
    const handler = (createCustomerPortal as any)._handler;
    const result = await handler(mockPortalData, mockContext);

    // Assert
    expect(consoleLogSpy).toHaveBeenCalledWith("stripeCustomerId: ", undefined);
    expect(mockStripeBillingPortalCreate).toHaveBeenCalledWith({
      customer: undefined,
      return_url: "https://example.com/dashboard",
    });
    expect(result).toEqual({ url: "https://billing.stripe.com/session/test123" });
  });

  it("should handle database error when getting customer", async () => {
    // Arrange
    const error = new Error("Database error");
    mockGet.mockRejectedValue(error);

    // Act & Assert
    const handler = (createCustomerPortal as any)._handler;
    await expect(
      handler(mockPortalData, mockContext)
    ).rejects.toThrow("Database error");
    
    expect(mockDoc).toHaveBeenCalledWith("stripeCustomers/test-uid-123");
    expect(mockStripeBillingPortalCreate).not.toHaveBeenCalled();
  });

  it("should handle stripe billing portal creation error", async () => {
    // Arrange
    mockGet.mockResolvedValue(mockCustomerDoc);
    const stripeError = new Error("Stripe error");
    mockStripeBillingPortalCreate.mockRejectedValue(stripeError);

    // Act & Assert
    const handler = (createCustomerPortal as any)._handler;
    await expect(
      handler(mockPortalData, mockContext)
    ).rejects.toThrow("No se pudo crear la sesión del Customer Portal.");
    
    expect(mockStripeBillingPortalCreate).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error creando portal de cliente:", stripeError);
  });

  it("should handle context without auth uid", async () => {
    // Arrange
    const contextWithoutUid = {
      auth: {},
    };

    // Act & Assert
    const handler = (createCustomerPortal as any)._handler;
    await expect(
      handler(mockPortalData, contextWithoutUid)
    ).rejects.toThrow("Auth required.");
  });

  it("should log customer document details", async () => {
    // Arrange
    mockGet.mockResolvedValue(mockCustomerDoc);
    mockStripeBillingPortalCreate.mockResolvedValue(mockBillingPortalSession as any);

    // Act
    const handler = (createCustomerPortal as any)._handler;
    await handler(mockPortalData, mockContext);

    // Assert
    expect(consoleLogSpy).toHaveBeenCalledWith("custDoc: ", mockCustomerDoc);
    expect(consoleLogSpy).toHaveBeenCalledWith("stripeCustomerId: ", "cus_test123");
  });
});
