import axios from "axios";
import { API_URL } from "@/src/config/api";
import { getToken, clearToken } from "@/src/lib/authStorage";

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearToken();
    }
    return Promise.reject(error);
  }
);