import SelectProjectForm from "@/components/projects/SelectProjectForm/SelectProjectForm";
import { StripeProductCard } from "@/components/stripe/StripeProductCard";
import { fetchStripeProducts } from "@/services/stripe/service/stripeService";
import { useAppStore } from "@/stores/app-store";
import { SelectProjectFormValues } from "@/types/form-values-types";
import { StripeProduct } from "@/types/stripe-types";
import { FormikHelpers } from "formik";
import { useEffect, useState } from "react";

export const StripeProductsView = () => {
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedProjectId = useAppStore((state) => state.selectedProjectId);

  const setSelectedProjectId = useAppStore(
    (state) => state.setSelectedProjectId
  );

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

    return () => {
      setSelectedProjectId("");
    };
  }, []);

  const handleSubmit = async (
    values: SelectProjectFormValues,
    formikHelpers: FormikHelpers<SelectProjectFormValues>
  ) => {
    try {
      setSelectedProjectId(values.projectId);
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error getting project: ", error);
      alert("Error getting project!");
    }
  };

  return (
    <>
      <SelectProjectForm buttonText="SUBMIT" onSubmit={handleSubmit} />

      {selectedProjectId && isLoading ? (
        <div className="flex justify-center items-center mt-40">
          <p>Loading Stripe Products...</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3 mt-5">
          {selectedProjectId &&
            products.map((product, index) => {
              const firstPrice = product.prices[0];
              return (
                <StripeProductCard
                  key={index}
                  name={product.name}
                  price={firstPrice}
                  selectedProjectId={selectedProjectId}
                />
              );
            })}
        </div>
      )}
    </>
  );
};
