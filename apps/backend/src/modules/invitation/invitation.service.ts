import { InvitationStatus, MembershipRoles } from "db/client";
import { AppError } from "../../errors/AppError";
import { AuthRepository } from "../auth/auth.repository";
import { OrganisationRepository } from "../organisation/organisation.repository";
import { InvitationRepository } from "./invitation.repository";
import { AcceptInvitationInput, CreateInvitationInput } from "shared";
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
      expiresAt: invitation.expiresAt,
    };
  }
  async acceptInvitation(input: AcceptInvitationInput) {
    const { userId, token } = input;
    const invitation = await this.invitationRepository.findByToken(token);
    if (!invitation) {
      throw new AppError("Invalid Invitation");
    }
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new AppError("this invitation is no lonver valid", 400);
    }
    if (invitation.expiresAt < new Date()) {
      throw new AppError("this invitation is no lonver valid", 400);
    }
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new AppError(
        "This invitation was sent to a different email address",
        403,
      );
    }
    const existingMemberShip = await this.organisationRepository.findMembership(
      userId,
      invitation.organisationId,
    );
    if (existingMemberShip) {
      throw new AppError("You are already a member of this organisation", 409);
    }
    const membership = await this.organisationRepository.createMembership(
      userId,
      invitation.organisationId,
      MembershipRoles.MEMBER,
    );
    await this.invitationRepository.markAsAccepted(invitation.id);
    return membership;
  }
}
