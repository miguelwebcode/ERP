// functions/src/index.ts
// import * as admin from "firebase-admin";
// import { onCall, HttpsError } from "firebase-functions/v2/https";
// import * as dotenv from "dotenv";
// import Stripe from "stripe";
// import { functions } from "./firebaseConfig";

// 1. Carga variables .env en desarrollo
// dotenv.config();

// 2. Inicializa Admin SDK
// admin.initializeApp();
// const db = admin.firestore();

// 3. Obtén la clave secreta de Stripe
// export const stripeSecret = process.env.STRIPE_SECRET;
// if (!stripeSecret) {
//   throw new Error(
//     "❌ STRIPE_SECRET no está definido en las variables de entorno."
//   );
// }

// 4. Inicializa Stripe
// export const stripe = new Stripe(stripeSecret, {
//   apiVersion: "2025-03-31.basil",
// });

// 5. Función Callable (v2) para crear un Customer
// export const addStripeCustomer = onCall(
//   { region: "europe-west1" },
//   async (request) => {
//     // 5.1. Verifica que venga autenticado
//     const uid = request.auth?.uid;
//     if (!uid) {
//       throw new HttpsError("unauthenticated", "Login requerido.");
//     }

//     // 5.2. Extrae projectId del payload
//     const { projectId } = request.data as { projectId: string };
//     if (!projectId) {
//       throw new HttpsError("invalid-argument", "Missing projectId");
//     }

//     // 5.3. Crea el Customer en Stripe con metadata
//     const customer = await stripe.customers.create({
//       metadata: { firebaseUID: uid, projectId },
//     });

//     // 5.4. Guarda el customerId en Firestore
//     await db
//       .collection("projects")
//       .doc(projectId)
//       .set({ stripeCustomerId: customer.id }, { merge: true });

//     // 5.5. Retorna el ID al cliente
//     return { customerId: customer.id };
//   }
// );

// export const addCheckoutSession = onCall(
//   { region: "europe-west1" },
//   async (request) => {
//     const { customerId, priceId, mode, projectId } = request.data as {
//       customerId: string;
//       priceId: string;
//       mode: "payment" | "subscription";
//       projectId: string;
//     };

//     if (!customerId || !priceId || !mode || !projectId) {
//       throw new HttpsError("invalid-argument", "Faltan parámetros");
//     }

//     // Genera la sesión de Checkout en Stripe
//     const session = await stripe.checkout.sessions.create({
//       customer: customerId,
//       mode,
//       line_items: [{ price: priceId, quantity: 1 }],
//       client_reference_id: projectId,
//       success_url: `${request.rawRequest.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${request.rawRequest.headers.origin}/cancel`,
//       metadata: { projectId },
//     });

//     return { sessionId: session.id };
//   }
// );

export * from "./createStripeCustomer";
export * from "./createCheckoutSession";
export * from "./handleStripeWebhook";
export * from "./createCustomerPortal";
export * from "./cleanupStripeCustomer";
