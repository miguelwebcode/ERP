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
        setProducts(data!.products);
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
    <div className="flex flex-col items-center gap-8 p-6">
      <SelectProjectForm buttonText="SUBMIT" onSubmit={handleSubmit} />

      {selectedProjectId && isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <p className="text-lg text-gray-600">Loading Stripe Products...</p>
        </div>
      ) : (
        selectedProjectId && (
          <div className="w-full max-w-3xl">
            <div className="space-y-0">
              {products.map((product, index) => {
                const firstPrice = product.prices[0];
                return (
                  <div key={index} className={`${index !== products.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <StripeProductCard
                      name={product.name}
                      price={firstPrice}
                      selectedProjectId={selectedProjectId}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
};
