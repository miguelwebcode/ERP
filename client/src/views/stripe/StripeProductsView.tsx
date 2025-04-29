import { StripeProductCard } from "@/components/stripe/StripeProductCard";
import { fetchStripeProducts } from "@/services/stripe/service/stripeService";
import { StripeProduct } from "@/types/stripe-types";
import { useEffect, useState } from "react";

export const StripeProductsView = () => {
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="flex flex-wrap justify-center gap-3">
        {products.map((product) => {
          const firstPrice = product.prices[0];
          return <StripeProductCard name={product.name} price={firstPrice} />;
        })}
      </div>
    </>
  );
};
