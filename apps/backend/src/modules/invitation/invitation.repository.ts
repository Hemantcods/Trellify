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
}
