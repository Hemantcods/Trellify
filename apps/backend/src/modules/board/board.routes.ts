import express from "express";
import { validate } from "../../middleware/validate.middleware";
import {
  boardIdParamsSchema,
  boardOnlyIdSchema,
  createBoardSchema,
  createSectionSchema,
  organisationIdParamSchema,
  updateBoardSchema,
} from "shared";
import { boardController } from "./board.container";
import { requireAuth } from "../../middleware/auth.middleware";
const router = express.Router();
router.post(
  "/:organisationId/create",
  validate(organisationIdParamSchema, "params"),
  validate(createBoardSchema),
  requireAuth,
  boardController.createBoard,
);
router.get(
  "/:organisationId/boards",
  validate(organisationIdParamSchema, "params"),
  requireAuth,
  boardController.getBoards,
);
router.get(
  "/:organisationId/:boardId",
  validate(boardIdParamsSchema, "params"),
  requireAuth,
  boardController.getBoardById,
);
router.patch(
  "/:organisationId/:boardId",
  validate(updateBoardSchema),
  requireAuth,
  boardController.updateBoard,
);
router.delete(
  "/:organisationId/boards/:boardId",
  validate(boardIdParamsSchema, "params"),
  requireAuth,
  boardController.deleteBoard,
);
export default router;