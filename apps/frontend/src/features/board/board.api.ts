import { api } from "@/lib/api";
import type { Board, CreateBoardInput, UpdateOrganisationInput } from "shared";

export const BoardApi = {
  createBoard: async (organisationId: string, data: CreateBoardInput) => {
    const response = await api.post(`/board/${organisationId}/create`,data);
    return response.data.data as Board;
  },
  getBoards: async (organisationId: string) => {
    const response = await api.get(`/board/${organisationId}/boards`);
    return response.data.data as Board[];
  },
  getBoardById: async (organisationId: string, boardId: string) => {
    const response = await api.get(`/board/${organisationId}/${boardId}`);
    return response.data.data as Board;
  },
  updateBoard: async (
    organisationId: string,
    boardId: string,
    data: UpdateOrganisationInput,
  ) => {
    const response = await api.put(`/board/${organisationId}/${boardId}`,data);
    return response.data.data;
  },
  deleteBoard: async (organisationId: string, boardId: string) => {
    const response = await api.delete(`/board/${organisationId}/${boardId}`);
    return response.data;
  },
};
