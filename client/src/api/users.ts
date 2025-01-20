import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const fetchUserData = async () => {
  const response = await axios.get(`${BASE_URL}/users`);
  return response.data;
};

export const createUser = async (user: { name: string; email: string }) => {
  const response = await axios.post(`${BASE_URL}/users`, user);

  return response.data;
};
