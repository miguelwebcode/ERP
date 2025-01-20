import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const fetchCustomerData = async () => {
  const response = await axios.get(`${BASE_URL}/customers`);
  return response.data;
};

export const createCustomer = async (customer: {
  name: string;
  email: string;
}) => {
  const response = await axios.post(`${BASE_URL}/customers`, customer);
  return response.data;
};
