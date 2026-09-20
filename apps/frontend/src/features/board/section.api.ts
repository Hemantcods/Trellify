import { api } from "@/lib/api";
import type { CreateSectionInput, UpdateSectionInput } from "shared";

export interface Section {
  id: string;
  title: string;
  boardId: string;
  position: number;
}

export const SectionApi = {
  getSections: async (boardId: string) => {
    const response = await api.get(`/board/${boardId}/sections`);
    return response.data.data as Section[];
  },

  createSection: async (boardId: string, data: CreateSectionInput) => {
    const response = await api.post(`/board/${boardId}/sections`, data);
    return response.data.data as Section;
  },

  updateSection: async (sectionId: string, data: UpdateSectionInput) => {
    const response = await api.patch(`/section/${sectionId}`, data);
    return response.data.data as Section;
  },

  deleteSection: async (sectionId: string) => {
    const response = await api.delete(`/section/${sectionId}`);
    return response.data;
  },
};
