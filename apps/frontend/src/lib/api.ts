import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }
    const orignalReq = error.config;
    if (orignalReq.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }
    await api.post("/auth/refresh");
    return api(orignalReq);
  },
);
