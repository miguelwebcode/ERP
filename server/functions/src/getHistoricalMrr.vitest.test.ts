import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { getHistoricalMrr } from "./getHistoricalMrr";
import { db } from "./firebaseConfig";
import { MrrMonth, Subscription } from "./types";

// Mock de Firebase Functions
vi.mock("firebase-functions/v1", () => ({
  region: vi.fn(() => ({
    https: {
      onCall: vi.fn((handler) => ({ _handler: handler })),
    },
  })),
}));

// Mock de Firebase Config
vi.mock("./firebaseConfig", () => ({
  db: {
    collection: vi.fn(),
  },
}));

describe("getHistoricalMrr", () => {
  let mockCollection: Mock;
  let mockWhere: Mock;
  let mockGet: Mock;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const mockSubscriptions: Subscription[] = [
    {
      createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
      currentPeriodEnd: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
      interval: "month",
      amount: 2000, // $20.00 in cents
      latestInvoice: "in_test123",
      projectId: "project1",
      stripeCustomerId: "cus_test123",
      stripeSubscriptionId: "sub_test123",
      status: "active",
    },
    {
      createdAt: Date.now() - (60 * 24 * 60 * 60 * 1000), // 60 days ago
      currentPeriodEnd: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
      interval: "year",
      amount: 12000, // $120.00 in cents annually
      latestInvoice: "in_test124",
      projectId: "project2",
      stripeCustomerId: "cus_test124",
      stripeSubscriptionId: "sub_test124",
      status: "active",
    },
    {
      createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000), // 90 days ago
      currentPeriodEnd: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 days ago (expired)
      interval: "month",
      amount: 1500, // $15.00 in cents
      latestInvoice: "in_test125",
      projectId: "project3",
      stripeCustomerId: "cus_test125",
      stripeSubscriptionId: "sub_test125",
      status: "active",
      canceledAt: Date.now() - (5 * 24 * 60 * 60 * 1000), // canceled 5 days ago
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");

    // Setup Firebase mocks
    mockGet = vi.fn();
    mockWhere = vi.fn();
    mockCollection = vi.mocked(db.collection);

    // Configure mock chains
    mockCollection.mockReturnValue({ where: mockWhere } as any);
    mockWhere.mockReturnValue({ get: mockGet } as any);
  });

  it("should return historical MRR for last 12 months", async () => {
    // Arrange
    const mockSnapshot = {
      docs: mockSubscriptions.map(subscription => ({
        data: () => subscription,
      })),
    };
    mockGet.mockResolvedValue(mockSnapshot);

    // Act - Get the handler function and call it
    const handler = (getHistoricalMrr as any)._handler;
    const result = await handler({}, {});

    // Assert
    expect(mockCollection).toHaveBeenCalledWith("subscriptions");
    expect(mockWhere).toHaveBeenCalledWith("status", "in", ["active", "past_due"]);
    expect(mockGet).toHaveBeenCalled();
    
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(12);
    
    // Each result should have month and revenue
    result.forEach((item: MrrMonth) => {
      expect(item).toHaveProperty("month");
      expect(item).toHaveProperty("revenue");
      expect(typeof item.month).toBe("string");
      expect(typeof item.revenue).toBe("number");
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should filter subscriptions by active and past_due status", async () => {
    // Arrange
    const mockSnapshot = {
      docs: mockSubscriptions.map(subscription => ({
        data: () => subscription,
      })),
    };
    mockGet.mockResolvedValue(mockSnapshot);

    // Act
    const handler = (getHistoricalMrr as any)._handler;
    const result = await handler({}, {});

    // Assert
    expect(mockCollection).toHaveBeenCalledWith("subscriptions");
    expect(mockWhere).toHaveBeenCalledWith("status", "in", ["active", "past_due"]);
    expect(mockGet).toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(true);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle empty subscriptions collection", async () => {
    // Arrange
    const mockSnapshot = {
      docs: [],
    };
    mockGet.mockResolvedValue(mockSnapshot);

    // Act
    const handler = (getHistoricalMrr as any)._handler;
    const result = await handler({}, {});

    // Assert
    expect(mockCollection).toHaveBeenCalledWith("subscriptions");
    expect(mockWhere).toHaveBeenCalledWith("status", "in", ["active", "past_due"]);
    expect(mockGet).toHaveBeenCalled();
    
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(12);
    
    // All months should have 0 revenue
    result.forEach((item: MrrMonth) => {
      expect(item.revenue).toBe(0);
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle database error", async () => {
    // Arrange
    const error = new Error("Database error");
    mockGet.mockRejectedValue(error);

    // Act & Assert
    const handler = (getHistoricalMrr as any)._handler;
    await expect(handler({}, {})).rejects.toThrow("Database error");
    
    expect(mockCollection).toHaveBeenCalledWith("subscriptions");
    expect(mockWhere).toHaveBeenCalledWith("status", "in", ["active", "past_due"]);
    expect(mockGet).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error getting historical MRR: ", error);
  });

  it("should normalize annual subscriptions to monthly revenue", async () => {
    // Arrange
    const annualSubscription: Subscription = {
      createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
      currentPeriodEnd: Date.now() + (330 * 24 * 60 * 60 * 1000), // 330 days from now (annual)
      interval: "year",
      amount: 12000, // $120.00 in cents annually = $10.00 monthly
      latestInvoice: "in_test123",
      projectId: "project1",
      stripeCustomerId: "cus_test123",
      stripeSubscriptionId: "sub_test123",
      status: "active",
    };

    const mockSnapshot = {
      docs: [annualSubscription].map(subscription => ({
        data: () => subscription,
      })),
    };
    mockGet.mockResolvedValue(mockSnapshot);

    // Act
    const handler = (getHistoricalMrr as any)._handler;
    const result = await handler({}, {});

    // Assert
    expect(mockCollection).toHaveBeenCalledWith("subscriptions");
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(12);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should return months in chronological order", async () => {
    // Arrange
    const mockSnapshot = {
      docs: mockSubscriptions.map(subscription => ({
        data: () => subscription,
      })),
    };
    mockGet.mockResolvedValue(mockSnapshot);

    // Act
    const handler = (getHistoricalMrr as any)._handler;
    const result = await handler({}, {});

    // Assert
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(12);
    
    // Check that months are in order (oldest first)
    for (let i = 1; i < result.length; i++) {
      // Each month string should be in format like "Jan24", "Feb24", etc.
      expect(typeof result[i].month).toBe("string");
      expect(result[i].month).toMatch(/^[A-Z][a-z]{2}\d{2}$/);
    }

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle subscriptions with canceled status", async () => {
    // Arrange
    const canceledSubscription: Subscription = {
      createdAt: Date.now() - (60 * 24 * 60 * 60 * 1000), // 60 days ago
      currentPeriodEnd: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
      interval: "month",
      amount: 1000, // $10.00 in cents
      latestInvoice: "in_test123",
      projectId: "project1",
      stripeCustomerId: "cus_test123",
      stripeSubscriptionId: "sub_test123",
      status: "active",
      canceledAt: Date.now() - (30 * 24 * 60 * 60 * 1000), // canceled 30 days ago
    };

    const mockSnapshot = {
      docs: [canceledSubscription].map(subscription => ({
        data: () => subscription,
      })),
    };
    mockGet.mockResolvedValue(mockSnapshot);

    // Act
    const handler = (getHistoricalMrr as any)._handler;
    const result = await handler({}, {});

    // Assert
    expect(mockCollection).toHaveBeenCalledWith("subscriptions");
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(12);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
