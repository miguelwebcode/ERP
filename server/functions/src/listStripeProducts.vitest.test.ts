import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { listStripeProducts } from "./listStripeProducts";
import { stripe } from "./firebaseConfig";
import { ListStripeProductsResponse } from "./types";

// Mock de Firebase Functions
vi.mock("firebase-functions/v1", () => ({
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
}));

// Mock de Firebase Config
vi.mock("./firebaseConfig", () => ({
  stripe: {
    products: {
      list: vi.fn(),
    },
    prices: {
      list: vi.fn(),
    },
  },
}));

describe("listStripeProducts", () => {
  let mockStripeProductsList: Mock;
  let mockStripePricesList: Mock;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const mockContext = {
    auth: {
      uid: "test-uid-123",
    },
  };

  const mockStripeProducts = {
    data: [
      {
        id: "prod_test123",
        name: "Basic Plan",
        description: "Basic subscription plan",
        active: true,
      },
      {
        id: "prod_test124",
        name: "Pro Plan",
        description: "Professional subscription plan",
        active: true,
      },
    ],
  };

  const mockStripePricesBasic = {
    data: [
      {
        id: "price_basic_monthly",
        unit_amount: 1000, // $10.00
        currency: "usd",
        type: "recurring",
        recurring: {
          interval: "month",
          interval_count: 1,
        },
      },
      {
        id: "price_basic_yearly",
        unit_amount: 10000, // $100.00
        currency: "usd",
        type: "recurring",
        recurring: {
          interval: "year",
          interval_count: 1,
        },
      },
    ],
  };

  const mockStripePricesPro = {
    data: [
      {
        id: "price_pro_monthly",
        unit_amount: 2000, // $20.00
        currency: "usd",
        type: "recurring",
        recurring: {
          interval: "month",
          interval_count: 1,
        },
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");

    // Setup Stripe mocks
    mockStripeProductsList = vi.mocked(stripe.products.list);
    mockStripePricesList = vi.mocked(stripe.prices.list);
  });

  it("should list stripe products with prices successfully", async () => {
    // Arrange
    mockStripeProductsList.mockResolvedValue(mockStripeProducts as any);
    mockStripePricesList
      .mockResolvedValueOnce(mockStripePricesBasic as any)
      .mockResolvedValueOnce(mockStripePricesPro as any);

    // Act - Get the handler function and call it
    const handler = (listStripeProducts as any)._handler;
    const result = await handler({}, mockContext);

    // Assert
    expect(mockStripeProductsList).toHaveBeenCalledWith({ active: true, limit: 100 });
    
    expect(mockStripePricesList).toHaveBeenCalledWith({
      product: "prod_test123",
      active: true,
      limit: 100,
    });
    expect(mockStripePricesList).toHaveBeenCalledWith({
      product: "prod_test124",
      active: true,
      limit: 100,
    });

    const expected: ListStripeProductsResponse = {
      products: [
        {
          productId: "prod_test123",
          name: "Basic Plan",
          description: "Basic subscription plan",
          prices: [
            {
              priceId: "price_basic_monthly",
              amount: 1000,
              currency: "usd",
              type: "recurring",
              recurring: {
                interval: "month",
                interval_count: 1,
              },
            },
            {
              priceId: "price_basic_yearly",
              amount: 10000,
              currency: "usd",
              type: "recurring",
              recurring: {
                interval: "year",
                interval_count: 1,
              },
            },
          ],
        },
        {
          productId: "prod_test124",
          name: "Pro Plan",
          description: "Professional subscription plan",
          prices: [
            {
              priceId: "price_pro_monthly",
              amount: 2000,
              currency: "usd",
              type: "recurring",
              recurring: {
                interval: "month",
                interval_count: 1,
              },
            },
          ],
        },
      ],
    };

    expect(result).toEqual(expected);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should throw error when user is not authenticated", async () => {
    // Arrange
    const unauthenticatedContext = { auth: null };

    // Act & Assert
    const handler = (listStripeProducts as any)._handler;
    await expect(
      handler({}, unauthenticatedContext)
    ).rejects.toThrow("Auth required");
  });

  it("should handle empty products list", async () => {
    // Arrange
    const emptyProducts = { data: [] };
    mockStripeProductsList.mockResolvedValue(emptyProducts as any);

    // Act
    const handler = (listStripeProducts as any)._handler;
    const result = await handler({}, mockContext);

    // Assert
    expect(mockStripeProductsList).toHaveBeenCalledWith({ active: true, limit: 100 });
    expect(mockStripePricesList).not.toHaveBeenCalled();

    const expected: ListStripeProductsResponse = {
      products: [],
    };

    expect(result).toEqual(expected);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle products with no prices", async () => {
    // Arrange
    const productWithNoPrices = {
      data: [
        {
          id: "prod_test123",
          name: "Basic Plan",
          description: "Basic subscription plan",
          active: true,
        },
      ],
    };
    const emptyPrices = { data: [] };
    
    mockStripeProductsList.mockResolvedValue(productWithNoPrices as any);
    mockStripePricesList.mockResolvedValue(emptyPrices as any);

    // Act
    const handler = (listStripeProducts as any)._handler;
    const result = await handler({}, mockContext);

    // Assert
    expect(mockStripeProductsList).toHaveBeenCalledWith({ active: true, limit: 100 });
    expect(mockStripePricesList).toHaveBeenCalledWith({
      product: "prod_test123",
      active: true,
      limit: 100,
    });

    const expected: ListStripeProductsResponse = {
      products: [
        {
          productId: "prod_test123",
          name: "Basic Plan",
          description: "Basic subscription plan",
          prices: [],
        },
      ],
    };

    expect(result).toEqual(expected);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle stripe products API error", async () => {
    // Arrange
    const stripeError = new Error("Stripe API error");
    mockStripeProductsList.mockRejectedValue(stripeError);

    // Act & Assert
    const handler = (listStripeProducts as any)._handler;
    await expect(handler({}, mockContext)).rejects.toThrow("Stripe API error");
    
    expect(mockStripeProductsList).toHaveBeenCalledWith({ active: true, limit: 100 });
    expect(mockStripePricesList).not.toHaveBeenCalled();
  });

  it("should handle stripe prices API error", async () => {
    // Arrange
    mockStripeProductsList.mockResolvedValue(mockStripeProducts as any);
    const pricesError = new Error("Prices API error");
    mockStripePricesList.mockRejectedValue(pricesError);

    // Act & Assert
    const handler = (listStripeProducts as any)._handler;
    await expect(handler({}, mockContext)).rejects.toThrow("Prices API error");
    
    expect(mockStripeProductsList).toHaveBeenCalledWith({ active: true, limit: 100 });
    expect(mockStripePricesList).toHaveBeenCalledWith({
      product: "prod_test123",
      active: true,
      limit: 100,
    });
  });

  it("should handle prices with null unit_amount", async () => {
    // Arrange
    const productsWithNullPrice = {
      data: [
        {
          id: "prod_test123",
          name: "Basic Plan",
          description: "Basic subscription plan",
          active: true,
        },
      ],
    };
    
    const pricesWithNull = {
      data: [
        {
          id: "price_test123",
          unit_amount: null,
          currency: "usd",
          type: "recurring",
          recurring: {
            interval: "month",
            interval_count: 1,
          },
        },
      ],
    };

    mockStripeProductsList.mockResolvedValue(productsWithNullPrice as any);
    mockStripePricesList.mockResolvedValue(pricesWithNull as any);

    // Act
    const handler = (listStripeProducts as any)._handler;
    const result = await handler({}, mockContext);

    // Assert
    expect(result.products[0].prices[0].amount).toBe(0);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle prices without recurring data", async () => {
    // Arrange
    const productsWithOneTimePrice = {
      data: [
        {
          id: "prod_test123",
          name: "One-time Product",
          description: "One-time payment product",
          active: true,
        },
      ],
    };
    
    const oneTimePrices = {
      data: [
        {
          id: "price_test123",
          unit_amount: 5000,
          currency: "usd",
          type: "one_time",
          recurring: null,
        },
      ],
    };

    mockStripeProductsList.mockResolvedValue(productsWithOneTimePrice as any);
    mockStripePricesList.mockResolvedValue(oneTimePrices as any);

    // Act
    const handler = (listStripeProducts as any)._handler;
    const result = await handler({}, mockContext);

    // Assert
    expect(result.products[0].prices[0].recurring).toBeNull();
    expect(result.products[0].prices[0].type).toBe("one_time");
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
