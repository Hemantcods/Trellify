import { OrganisationController } from "./organisation.controller";
import { OrganisationRepository } from "./organisation.repository";
import { OrganisationService } from "./organisation.service";

const organisationRepository = new OrganisationRepository();
const organisationService = new OrganisationService(organisationRepository);
export const organisationController = new OrganisationController(
  organisationService,
);
