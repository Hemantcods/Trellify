import express from "express";
import { validate } from "../../middleware/validate.middleware";
import {
  createCommentSchema,
  commentIdParamSchema,
  issueIdParamSchema,
} from "shared";
import { commentController } from "./comment.container";
import { requireAuth } from "../../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/issue/:issueId/comments",
  requireAuth,
  validate(issueIdParamSchema, "params"),
  validate(createCommentSchema),
  commentController.createComment,
);

router.get(
  "/issue/:issueId/comments",
  requireAuth,
  validate(issueIdParamSchema, "params"),
  commentController.getCommentsByIssue,
);

router.delete(
  "/:commentId",
  requireAuth,
  validate(commentIdParamSchema, "params"),
  commentController.deleteComment,
);

export default router;
