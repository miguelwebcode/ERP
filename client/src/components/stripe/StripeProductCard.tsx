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
  return (
    <div className="border flex flex-col items-center w-2/6 rounded-lg p-4 gap-3 shadow-md bg-white mb-4">
      <p className="text-lg font-bold mb-2">{name}</p>
      <p className="text-green-600 text-base mb-2">
        {`${formatCurrency(price.amount / 100, "EUR", "es-ES")}`}{" "}
        {price.type === "recurring" ? (
          <span className="text-sm text-gray-600">{`/ every ${price.recurring?.interval_count} ${price.recurring?.interval}s`}</span>
        ) : (
          <span className="text-sm text-gray-600">/ unique payment</span>
        )}
      </p>

      <button
        className="bg-blue-500 text-white font-semibold py-2 px-4 w-full rounded hover:bg-blue-600 transition duration-300"
        onClick={() => {
          handleCheckout(price.priceId, selectedProjectId, price.type);
        }}
      >
        PAY
      </button>
    </div>
  );
};
