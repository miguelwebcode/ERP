// functions/src/index.ts
import * as functions from "firebase-functions/v1"; // Gen 1 :contentReference[oaicite:3]{index=3}
import { stripe } from "./firebaseConfig"; // instancia configurada
import { ListStripeProductsResponse } from "./types";

// 1. Define la función callable
export const listStripeProducts = functions
  .region("europe-west1")
  .https.onCall(async (_, context): Promise<ListStripeProductsResponse> => {
    if (!context.auth)
      throw new functions.https.HttpsError("unauthenticated", "Auth required");

    // 2. Listar todos los productos activos
    const products = await stripe.products.list({ active: true, limit: 100 });
    // 3. Para cada producto, listar sus precios
    const result = await Promise.all(
      products.data.map(async (prod) => {
        const prices = await stripe.prices.list({
          product: prod.id,
          active: true,
          limit: 100,
        });

        const detailedPrices = prices.data.map((p) => ({
          priceId: p.id,
          amount: p.unit_amount ?? 0,
          currency: p.currency,
          recurring: p.recurring
            ? {
                interval: p.recurring.interval,
                interval_count: p.recurring.interval_count,
              }
            : null,
          type: p.type,
        }));
        return {
          productId: prod.id,
          name: prod.name,
          description: prod.description,
          prices: detailedPrices,
        };
      })
    );

    return { products: result };
  });
