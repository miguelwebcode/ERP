import { MrrMonth } from "@/types";
import { getHistoricalMrr } from "../repository/subscriptionsRepository";

export const fetchHistoricalMrr = async (
  callback: (value: MrrMonth[]) => void
) => {
  try {
    const { data } = await getHistoricalMrr();
    callback(data);
  } catch (error) {
    console.error("Error fetching historical MRR data: ", error);
  }
};
