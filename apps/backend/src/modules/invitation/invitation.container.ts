import { AuthRepository } from "../auth/auth.repository";
import { OrganisationRepository } from "../organisation/organisation.repository";
import { InvitationController } from "./invitation.controller";
import { InvitationRepository } from "./invitation.repository";
import { InvitationService } from "./invitation.service";

const invitationRepository = new InvitationRepository();
const organisationRepository = new OrganisationRepository();
const authRepository = new AuthRepository();
const invitationService = new InvitationService(
  invitationRepository,
  organisationRepository,
  authRepository,
);
export const invitationController = new InvitationController(invitationService);
