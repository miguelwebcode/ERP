import * as functions from "firebase-functions/v1";
import { db } from "./firebaseConfig";
import { MrrMonth, Subscription } from "./types";

export const getHistoricalMrr = functions
  .region("europe-west1")
  .https.onCall(async (_, context): Promise<MrrMonth[]> => {
    // 1. Recuperar todas las subscripciones activas/past_due
    const snap = await db
      .collection("subscriptions")
      .where("status", "in", ["active", "past_due"])
      .get();
    const subs = snap.docs.map((d) => d.data() as Subscription);

    // 2. Generar array de los últimos 12 meses
    const now = Date.now();
    const months = Array.from({ length: 12 })
      .map((_, i) => {
        const date = new Date(now);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        date.setMonth(date.getMonth() - i);
        return date;
      })
      .reverse();

    // 3. Funciones auxiliares
    const isActiveInMonth = (sub: Subscription, start: number, end: number) =>
      sub.createdAt <= end &&
      (sub.canceledAt ?? Infinity) > start &&
      sub.currentPeriodEnd >= start;

    const normalized = (sub: Subscription) => {
      const amt = sub.amount / 100;
      return sub.interval === "month" ? amt : amt / 12;
    };

    // 4. Calcular MRR histórico
    const history = months.map((m) => {
      const start = m.getTime();
      const endDate = new Date(m);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setMilliseconds(-1);
      const end = endDate.getTime();

      const revenue = subs
        .filter((sub) => isActiveInMonth(sub, start, end))
        .reduce((sum, sub) => sum + normalized(sub), 0);

      const monthName = m.toLocaleString("en-US", { month: "short" });
      return { month: monthName, revenue: revenue };
    });

    return history;
  });
