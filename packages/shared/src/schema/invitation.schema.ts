import z from "zod";

export const InvitationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  EXPIRED: "EXPIRED",
} as const;
export type InvitationStatus =
  (typeof InvitationStatus)[keyof typeof InvitationStatus];
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
  email: z.email("a valid email is required"),
});

export const AcceptInvteSchema = z.object({
  token: z.string().min(32, "Inavlid invite token"),
});
