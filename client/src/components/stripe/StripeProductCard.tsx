import { formatCurrency } from "@/lib/utils";
import { startProductCheckout } from "@/services/stripe/service/stripeService";
import { StripePriceDetails } from "@/types/stripe-types";

type StripeProductCardProps = {
  name: string;
  price: StripePriceDetails;
  selectedProjectId: string;
};

export const StripeProductCard = ({
  name,
  price,
  selectedProjectId,
}: StripeProductCardProps) => {
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
  const getPricingText = () => {
    if (price.type === "recurring") {
      const intervalCount = price.recurring?.interval_count || 1;
      if (intervalCount === 1) {
        return "every month";
      } else {
        return `every ${intervalCount} months`;
      }
    }
    return "unique payment";
  };

  return (
    <div className="flex items-center justify-between py-6 px-4 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xl font-bold text-green-600">
            {formatCurrency(price.amount / 100, "EUR", "es-ES")}
          </p>
          <p className="text-sm text-gray-600">
            / {getPricingText()}
          </p>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors duration-200 font-medium whitespace-nowrap"
          onClick={() => {
            handleCheckout(price.priceId, selectedProjectId, price.type);
          }}
        >
          PAY
        </button>
      </div>
    </div>
  );
};
