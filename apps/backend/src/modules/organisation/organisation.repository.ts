import { prisma } from "db/client";
import type { CreateOrganisationInput, UpdateOrganisationInput } from "shared";
import { AppError } from "../../errors/AppError";
export class OrganisationRepository {
  async createOrganisation(userId: string, data: CreateOrganisationInput) {
    return prisma.$transaction(
      async (tx) => {
        const organisation = await tx.organisation.create({
          data: {
            name: data.name,
            description: data.description,
          },
        });
        await tx.membership.create({
          data: {
            userId,
            organisationId: organisation.id,
            role: "OWNER",
          },
        });
        return organisation;
      },
      {
        maxWait: 10000,
        timeout: 20000,
      },
    );
  }
  async getUserOrganisations(userId: string) {
    return prisma.organisation.findMany({
      where: {
        memberships: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async getOrgnisationById(userId: string, organisationId: string) {
    return prisma.organisation.findFirst({
      where: {
        id: organisationId,
        memberships: {
          some: {
            userId,
          },
        },
      },
    });
  }
  async updateOrganisation(
    organisationId: string,
    userId: string,
    data: UpdateOrganisationInput,
  ) {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organisationId: {
          userId,
          organisationId,
        },
      },
    });
    if (!membership || membership.role !== "OWNER") {
      throw new AppError(
        "Only the organisation owner can update the organisation",
        403,
      );
    }
    return prisma.organisation.update({
      where: {
        id: organisationId,
      },
      data,
    });
  }
  async deleteOrganisation(organisationId: string, userId: string) {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organisationId: {
          userId,
          organisationId,
        },
      },
    });
    if (!membership || membership.role !== "OWNER") {
      throw new AppError(
        "only organisation ownwer can delete this organisation",
        403,
      );
    }
    return prisma.organisation.delete({
      where: {
        id: organisationId,
      },
    });
  }
}
