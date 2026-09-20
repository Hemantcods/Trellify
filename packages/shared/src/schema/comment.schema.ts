import z from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be less than 2000 characters"),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const commentIdParamSchema = z.object({
  commentId: z.uuid("Invalid comment ID"),
});
