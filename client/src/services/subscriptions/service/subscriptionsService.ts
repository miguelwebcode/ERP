import { getHistoricalMrr } from "../repository/subscriptionsRepository";

export const fetchHistoricalMrr = async () => {
  const { data } = await getHistoricalMrr();
  return data;
};
