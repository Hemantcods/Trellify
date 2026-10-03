import z from "zod";

export const CreateOrganisationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Organisation name is Required")
    .max(100, "Organisation name cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});
export type CreateOrganisationInput = z.infer<typeof CreateOrganisationSchema>;
export const organisationIdParamSchema = z.object({
  organisationId: z.uuid("Invalid organisation ID"),
});

export const MembershipRoles = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;

export type MembershipRoles =
  (typeof MembershipRoles)[keyof typeof MembershipRoles];

export const organisationSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  role: z.enum(MembershipRoles),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Organisation = z.infer<typeof organisationSchema>;

export const organisationMemberSchema = z.object({
  userId: z.uuid(),
  name: z.string(),
  email: z.email(),
  role: z.enum(MembershipRoles),
  joinedAt: z.string(),
});

export type OrganisationMember = z.infer<typeof organisationMemberSchema>;

export const updateOrganisationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Organisation name is required")
    .max(100, "Organisation name cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

export type UpdateOrganisationInput = z.infer<
  typeof updateOrganisationSchema
>;