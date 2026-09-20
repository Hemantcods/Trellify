import express from "express";
import { validate } from "../../middleware/validate.middleware";
import {
  createIssueSchema,
  updateIssueSchema,
  issueIdParamSchema,
  boardOnlyIdSchema,
  sectionIdParamSchema,
  reorderSchema,
  assigneeSchema,
} from "shared";
import { issueController } from "./issue.container";
import { requireAuth } from "../../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/section/:sectionId/issues",
  requireAuth,
  validate(sectionIdParamSchema, "params"),
  validate(createIssueSchema),
  issueController.createIssue,
);

router.get(
  "/board/:boardId/issues",
  requireAuth,
  validate(boardOnlyIdSchema, "params"),
  issueController.getIssuesByBoard,
);

router.get(
  "/:issueId",
  requireAuth,
  validate(issueIdParamSchema, "params"),
  issueController.getIssueById,
);

router.patch(
  "/:issueId",
  requireAuth,
  validate(issueIdParamSchema, "params"),
  validate(updateIssueSchema),
  issueController.updateIssue,
);

router.delete(
  "/:issueId",
  requireAuth,
  validate(issueIdParamSchema, "params"),
  issueController.deleteIssue,
);

router.post(
  "/:issueId/assignees",
  requireAuth,
  validate(issueIdParamSchema, "params"),
  validate(assigneeSchema),
  issueController.addAssignee,
);

router.delete(
  "/:issueId/assignees/:userId",
  requireAuth,
  validate(issueIdParamSchema, "params"),
  issueController.removeAssignee,
);

router.patch(
  "/section/:sectionId/issues/reorder",
  requireAuth,
  validate(sectionIdParamSchema, "params"),
  validate(reorderSchema),
  issueController.reorderIssues,
);

router.patch(
  "/board/:boardId/sections/reorder",
  requireAuth,
  validate(boardOnlyIdSchema, "params"),
  validate(reorderSchema),
  issueController.reorderSections,
);

export default router;
