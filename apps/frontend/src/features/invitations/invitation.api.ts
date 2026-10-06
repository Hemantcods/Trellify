import { api } from "@/lib/api";

export const acceptInvite = async (token: string) => {
  const response = await api.get(`/invitation/${token}`);
  return response.data.data;
};

export type Invitation = {
  id: string;
  email: string;
  organisationId: string;
  expiresAt: string;
};

type InviteMemberResponse = {
  success: boolean;
  message?: string;
  errors?: string | string[];
  data?: Invitation;
};

export const inviteMember = async (orgId: string, email: string) => {
  const response = await api.post<InviteMemberResponse>(
    `/invitation/${orgId}/invite`,
    { email },
  );
  return response.data;
};