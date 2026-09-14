import { MembershipRoles } from "db/client";
import { AppError } from "../../errors/AppError";
import { AuthRepository } from "../auth/auth.repository";
import { OrganisationRepository } from "../organisation/organisation.repository";
import { InvitationRepository } from "./invitation.repository";
import { CreateInvitationInput } from "shared";
import crypto from "crypto";
export class InvitationService {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly organisationRepository: OrganisationRepository,
    private readonly userRepository: AuthRepository,
  ) {}
  async createInvitation(input: CreateInvitationInput) {
    const { userId, organisationId, email } = input;
    const normalisedEmail = email.trim().toLowerCase();
    const membership = await this.organisationRepository.findMembership(
      userId,
      organisationId,
    );
    if (!membership) {
      throw new AppError("You are not a member of this organisation", 403);
    }
    if (membership.role !== MembershipRoles.MEMBER) {
      throw new AppError("You do not have permisstion to invite member", 403);
    }
    const existingUser =
      await this.userRepository.findUserByEmail(normalisedEmail);
    if (existingUser) {
      const existingMemberShip =
        await this.organisationRepository.findMembership(
          existingUser.id,
          organisationId,
        );
      if (existingMemberShip) {
        throw new AppError(
          "User is already a member of this organisation",
          409,
        );
      }
    }
    const existingInvitation =
      await this.invitationRepository.findPendingInvitation(
        normalisedEmail,
        organisationId,
      );
    if (existingInvitation) {
      throw new AppError(
        "An pending invitation alredy exists for this email",
        409,
      );
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    // TODO: Email Service
    const invitation = await this.invitationRepository.createInvitation({
      email: normalisedEmail,
      organisationId,
      token,
      expiresAt,
    });
    return {
      id: invitation.id,
      email: invitation.email,
      organisationId: invitation.organisationId,
      expiresAt:invitation.expiresAt
    }
  }
}