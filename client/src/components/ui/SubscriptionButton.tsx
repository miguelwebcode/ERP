import { startSubscription } from "@/services/stripe/service/stripeService";

export const SubscriptionButton = () => {
  const priceId = "price_1RHT8QGAhUu396a0kGfmK8PG";
  const projectId = "ThRZCXIv8nsnhqbE3QSx";
  const handleClick = async () => {
    try {
      await startSubscription(priceId, projectId);
    } catch (error) {
      console.error("Error al crear sesión: ", error);
    }
  };

  return <button onClick={handleClick}>Suscribirme</button>;
};
