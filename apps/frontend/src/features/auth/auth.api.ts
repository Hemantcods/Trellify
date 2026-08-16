import type { SigninInput, SignupInput } from "shared";
import { api } from "../../lib/api";
export const authApi = {
  signup: async (data: SignupInput) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },
  signin: async (data: SigninInput) => {
    const response = await api.post("/auth/signin", data);
    return response.data;
  },
  refresh: async () => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },
  signout: async () => {
    const response = await api.post("/api/signout");
    return response.data;
  },
  googleLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  },
  me: async() => {
    const response = await api.post("/auth/me");
    return response
  }
};
