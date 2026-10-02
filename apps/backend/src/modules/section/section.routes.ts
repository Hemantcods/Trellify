import express from "express";
import { validate } from "../../middleware/validate.middleware";
import {
  boardOnlyIdSchema,
  createSectionSchema,
  sectionIdParamSchema,
  updateSectionSchema,
} from "shared";
import { sectionController } from "./section.container";
import { requireAuth } from "../../middleware/auth.middleware";
import { boardController } from "../board/board.container";

const router = express.Router();

router.get(
  "/:boardId",
  validate(boardOnlyIdSchema, "params"),
  requireAuth,
  boardController.getSections,
);

router.post(
  "/:boardId/",
  requireAuth,
  validate(boardOnlyIdSchema, "params"),
  validate(createSectionSchema),
  boardController.createSection,
);

router.patch(
  "/:sectionId",
  requireAuth,
  validate(sectionIdParamSchema, "params"),
  validate(updateSectionSchema),
  sectionController.updateSection,
);

router.delete(
  "/:sectionId",
  requireAuth,
  validate(sectionIdParamSchema, "params"),
  sectionController.deleteSection,
);

export default router;
