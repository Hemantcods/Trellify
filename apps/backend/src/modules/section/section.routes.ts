import express from "express";
import { validate } from "../../middleware/validate.middleware";
import {
  sectionIdParamSchema,
  updateSectionSchema,
} from "shared";
import { sectionController } from "./section.container";
import { requireAuth } from "../../middleware/auth.middleware";

const router = express.Router();

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
