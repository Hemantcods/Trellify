import z from "zod";

export const createSectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Section title is required")
    .max(100, "Section title must be less than 100 characters"),
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;

export const updateSectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Section title is required")
    .max(100, "Section title must be less than 100 characters")
    .optional(),
  position: z.number().int().min(0).optional(),
});

export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;

export const sectionIdParamSchema = z.object({
  sectionId: z.uuid("Invalid section ID"),
});

export const boardIdParamSchema = z.object({
  boardId: z.uuid("Invalid board ID"),
});
