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
  id: z.uuid("Invalid organisation ID"),
});

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