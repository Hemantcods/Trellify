import express from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { inviteEmailSchema, organisationIdParamSchema } from "shared";
import { invitationController } from "./invitation.container";

const router = express.Router();

router.post(
  "/:organisationId/invite",
  requireAuth,
  validate(organisationIdParamSchema, "params"),
  validate(inviteEmailSchema),
  invitationController.createInvitation,
);

export default router;
