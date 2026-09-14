import { InvitationStatus, prisma } from "db/client";
export class InvitationRepository {
  async createInvitation(data: {
    email: string;
    organisationId: string;
    token: string;
    expiresAt: Date;
  }) {
    return prisma.invitation.create({ data });
  }
  async findByToken(token: string) {
    return prisma.invitation.findUnique({
      where: {
        token,
      },
    });
  }
  async findPendingInvitation(email: string, organisationId: string) {
    return prisma.invitation.findFirst({
      where: {
        email,
        organisationId,
        status: InvitationStatus.PENDING,
      },
    });
  }
  async findById(id: string) {
    return prisma.invitation.findUnique({
      where: {
        id,
      },
    });
  }
  async markAsAccepted(id: string) {
    return prisma.invitation.update({
      where: {
        id,
      },
      data: {
        status: InvitationStatus.ACCEPTED,
      },
    });
  }
  async findOrgInvitations(organisationId: string) {
    return prisma.invitation.findMany({
      where: {
        organisationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}