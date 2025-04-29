import { getCurrencySymbol } from "@/lib/utils";
import {
  fetchStripeProducts,
  startProductCheckout,
} from "@/services/stripe/service/stripeService";
import { StripeProduct } from "@/types/stripe-types";
import { useEffect, useState } from "react";

export const StripeProductsView = () => {
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const projectId = "ThRZCXIv8nsnhqbE3QSx";

  const handleCheckout = async (
    priceId: string,
    projectId: string,
    mode: "recurring" | "one_time"
  ) => {
    try {
      const modeValue = mode === "recurring" ? "subscription" : "payment";
      await startProductCheckout(priceId, projectId, modeValue);
    } catch (error) {
      console.error("Error al crear sesión: ", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchStripeProducts();
        setProducts(data.products);
      } catch (error) {
        console.error("Error loading stripe products: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return <p>Loading Stripe Products...</p>;
  }
  return (
    <>
      <div className="flex flex-wrap gap-3">
        {products.map((product) => {
          const firstPrice = product.prices[0];
          return (
            <div className="border flex flex-col w-2/4 rounded-lg p-4 shadow-md bg-white mb-4">
              <p className="text-lg font-bold mb-2">{product.name}</p>
              <p className="text-green-600 text-base mb-2">{`${
                firstPrice.amount / 100
              }${getCurrencySymbol(firstPrice.currency)}`}</p>
              {firstPrice.type === "recurring" ? (
                <p className="text-sm text-gray-600">{`every ${firstPrice.recurring?.interval_count} ${firstPrice.recurring?.interval}s`}</p>
              ) : (
                <p className="text-sm text-gray-600">unique payment</p>
              )}
              <button
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                onClick={() => {
                  handleCheckout(
                    firstPrice.priceId,
                    projectId,
                    firstPrice.type
                  );
                }}
              >
                PAY
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};
