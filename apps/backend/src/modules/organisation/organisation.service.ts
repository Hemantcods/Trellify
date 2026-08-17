import { CreateOrganisationInput, UpdateOrganisationInput } from "shared";
import { OrganisationRepository } from "./organisation.repository";
import { AppError } from "../../errors/AppError";

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
  async getUserOrganisation(userId:string) {
    return this.organisationRepository.getUserOrganisations(userId)
  }
  async getOrgById(organisationId: string, userId: string) {
    const organisation =await this.organisationRepository.getOrgnisationById(userId, organisationId)
    if (!organisation) {
      throw new AppError("Organisation not found",404)
    }
    return organisation;
  }
  async updateOrg(organisationId: string, userId: string, data: UpdateOrganisationInput) {
    return this.organisationRepository.updateOrganisation(organisationId, userId, data)
  }
  async deleteOrg(organisationId: string, userId: string) {
    return this.organisationRepository.deleteOrganisation(organisationId, userId)
  }
}
