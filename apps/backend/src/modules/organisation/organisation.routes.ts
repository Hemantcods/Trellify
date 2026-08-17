import express from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { CreateOrganisationSchema, organisationIdParamSchema, updateOrganisationSchema } from "shared";
import { organisationController } from "./organisation.container";

const router = express.Router();

router.post(
  "/create",
  requireAuth,
  validate(CreateOrganisationSchema),
  organisationController.createOrganisation,
);
router.get("/", requireAuth, organisationController.getUserOrganisations);
router.get("/:id", requireAuth, validate(organisationIdParamSchema, "params"), organisationController.getOrgById)
router.put("/:id",requireAuth,validate(organisationIdParamSchema,"params"),validate(updateOrganisationSchema),organisationController.updateOrg)
router.delete("/:id",requireAuth,validate(organisationIdParamSchema,"params"),organisationController.deleteOrg)
export default router;
