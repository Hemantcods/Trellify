import z from "zod";

export const createIssueSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Issue title is required")
    .max(200, "Issue title must be less than 200 characters"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;

export const updateIssueSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Issue title is required")
    .max(200, "Issue title must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  sectionId: z.uuid("Invalid section ID").optional(),
  position: z.number().int().min(0).optional(),
});

export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;

export const issueIdParamSchema = z.object({
  issueId: z.uuid("Invalid issue ID"),
});

export const reorderSchema = z.object({
  itemIds: z.array(z.string().uuid()).min(1, "At least one item is required"),
});

export type ReorderInput = z.infer<typeof reorderSchema>;

export const assigneeSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export type AssigneeInput = z.infer<typeof assigneeSchema>;
