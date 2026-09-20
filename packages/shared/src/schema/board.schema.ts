import z from "zod";

export const createBoardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Board title is required")
    .max(100, "Board title must be less than 100 characters"),
});
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export const updateBoardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Board title is required")
    .max(100, "Board title must be less than 100 characters"),
});
export type updateBoardSchema = z.infer<typeof updateBoardSchema>;
export const boardSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  organisationId: z.uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Board = z.infer<typeof boardSchema>;

export const boardIdParamsSchema = z.object({
  organisationId: z.uuid(),
  boardId: z.uuid(),
});

export const boardOnlyIdSchema = z.object({
  boardId: z.uuid(),
});
