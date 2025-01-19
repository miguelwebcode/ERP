import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const fetchProjectData = async () => {
  const response = await axios.get(`${BASE_URL}/projects`);
  return response.data as JSON;
};

export const createProject = async (user: { name: string; email: string }) => {
  const response = await axios.post(`${BASE_URL}/projects`, user);
  return response.data;
};
