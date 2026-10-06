import { CreateOrganisationInput, UpdateOrganisationInput } from "shared";
import { OrganisationRepository } from "./organisation.repository";
import { AppError } from "../../errors/AppError";
import { organisationMemberSchema } from "shared";
import { prisma } from "db/client";

export class OrganisationService {
  constructor(
    private readonly organisationRepository: OrganisationRepository,
  ) {}
  async createOrganisation(userId: string, data: CreateOrganisationInput) {
    const organisation = await this.organisationRepository.createOrganisation(
      userId,
      data,
    );
    return {
      name: organisation.name,
      description: organisation.description,
    };
  }
  async getUserOrganisation(userId: string) {
    const organisations = await this.organisationRepository.getUserOrganisations(userId)
    return organisations.map((org) => {
      const membership = org.memberships?.[0]
      return {
        ...org,
        role: membership?.role,
      }
    })
  }
  async getOrgById(organisationId: string, userId: string) {
    const organisation = await this.organisationRepository.getOrgnisationById(userId, organisationId)
    if (!organisation) {
      throw new AppError("Organisation not found", 404)
    }
    const membership = organisation.memberships?.[0]
    return {
      ...organisation,
      role: membership?.role,
    }
  }
  async updateOrg(organisationId: string, userId: string, data: UpdateOrganisationInput) {
    return this.organisationRepository.updateOrganisation(organisationId, userId, data)
  }
  async deleteOrg(organisationId: string, userId: string) {
    return this.organisationRepository.deleteOrganisation(organisationId, userId)
  }
  async getOrgMembers(organisationId: string, userId: string) {
    const membership = await this.organisationRepository.findMembership(userId, organisationId)
    if (!membership || membership.role !== "OWNER") {
      throw new AppError("Only the organisation owner can view members", 403)
    }
    const members = await prisma.membership.findMany({
      where: { organisationId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    })
    return members.map((m) => ({
      userId: m.userId,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
      joinedAt: m.createdAt,
    }))
  }
}
