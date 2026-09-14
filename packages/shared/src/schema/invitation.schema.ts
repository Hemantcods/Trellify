import z from "zod";

export enum InvitationStatus {
  PENDING,
  ACCEPTED,
  EXPIRED,
}
export type CreateInvitationInput = {
  userId: string;
  organisationId: string;
  email: string;
};
export type AcceptInvitationInput = {
  token: string;
  userId: string;
};
export const inviteEmailSchema = z.object({
  email:z.email("a valid email is required")
})