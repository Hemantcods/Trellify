import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { OrganisationService } from "./organisation.service";

export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}
  createOrganisation = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const data = req.body;
    const organisation = await this.organisationService.createOrganisation(
      userId!,
      data,
    );
    return res.status(201).json({
      success: true,
      data: organisation,
    });
  };
  getUserOrganisations = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id!;
    const organisations =
      await this.organisationService.getUserOrganisation(userId);
    return res.status(200).json({
      success: true,
      data: organisations,
    });
  };
  getOrgById = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id!;
    const organisationId = req.params.id as string;
    const organisation = await this.organisationService.getOrgById(
      organisationId,
      userId,
    );
    return res.status(200).json({
      success: 200,
      data: organisation,
    });
  };
  updateOrg = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id!;
    const organisationId = req.params.id as string;
    const organisation = await this.organisationService.updateOrg(
      organisationId,
      userId,
      req.body,
    );
    return res.status(200).json({
      success: true,
      data: organisation,
    });
  };
  deleteOrg = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id!;
    const organisationId = req.params.id as string;
    await this.organisationService.deleteOrg(organisationId, userId);
    return res.status(200).json({
      success: true,
      message: "Organisation deleted successfully",
    });
  };
}
