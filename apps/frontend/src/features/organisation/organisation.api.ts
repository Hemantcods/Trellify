import { api } from "@/lib/api";
import type { CreateOrganisationInput, UpdateOrganisationInput } from "shared";

export const OrganisationApi = {
  createBoard: async (data: CreateOrganisationInput)=>{
    const response =await api.post("/organisation/create", data)
    return response
  },
  getOrgbyId: async (ordId: string) => {
    const response = await api.get(`/organisation/${ordId}`)
    return response
  },
  getAllOrgs: async () => {
    const response = await api.get("/organisation/");
    return response.data;
  },
  updateOrg: async (orgId:string,data: UpdateOrganisationInput) => {
    const response = await api.put(`/organisation/${orgId}`, data)
    return response;
  },
  deleteOrg: async (orgId: string) => {
    const response = await api.delete(`/organisation/${orgId}`)
    return response
  },
}