import { MrrMonth } from "@/types";
import { getHistoricalMrr } from "../repository/subscriptionsRepository";

export const fetchHistoricalMrr = async (
  callback: (value: MrrMonth[]) => void
) => {
  const { data } = await getHistoricalMrr();
  callback(data);
};
