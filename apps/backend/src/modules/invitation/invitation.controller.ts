import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { InvitationService } from "./invitation.service";

export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}
  createInvitation = async (req: AuthRequest, res: Response) => {
    const organisationId = req.params.organisationId as string;
    const email = req.body;
    const userId = req.user?.id!;
    const invitation = await this.invitationService.createInvitation({
      userId,
      organisationId,
      email,
    });
    return res.status(200).json({
      success: true,
      data: invitation,
      message: "Invitation Sent sucessfull",
    });
  };
}
