import { api } from "@/lib/api";

export const acceptInvite = async (token: string) => {
  const response = await api.get(`/invitation/${token}`);
  return response.data.data;
};
