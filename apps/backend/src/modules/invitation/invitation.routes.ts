import express from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  AcceptInvteSchema,
  inviteEmailSchema,
  organisationIdParamSchema,
} from "shared";
import { invitationController } from "./invitation.container";

const router = express.Router();

router.post(
  "/:organisationId/invite",
  requireAuth,
  validate(organisationIdParamSchema, "params"),
  validate(inviteEmailSchema),
  invitationController.createInvitation,
);
router.get(
  "/:token",
  requireAuth,
  validate(AcceptInvteSchema, "params"),
  invitationController.acceptInvitation,
);
export default router;
