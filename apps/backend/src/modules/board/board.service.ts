import { CreateBoardInput, UpdateOrganisationInput } from "shared";
import { BoardRepository } from "./board.repository";

export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}
  async createBoard(
    userId: string,
    organisationId: string,
    data: CreateBoardInput,
  ) {
    return this.boardRepository.createBoard(userId, {
      ...data,
      organisationId,
    });
  }
  async getBoards(userId: string, organisationId: string) {
    return this.boardRepository.findBoardByOrgId(userId, organisationId);
  }
  async getBoardById(userId: string, boardId: string, organisationId: string) {
    return this.boardRepository.findBoardByOrgIdandBoardId(
      userId,
      boardId,
      organisationId,
    );
  }
  async updateBoard(
    userId: string,
    boardId: string,
    organisationId: string,
    data: UpdateOrganisationInput,
  ) {
    return this.boardRepository.updateBoard(userId, boardId, {
      ...data,
      organisationId,
    });
  }
  async deleteBoard(userId: string, organisationId: string, boardId: string) {
    return this.boardRepository.deleteBoard(userId, organisationId, boardId);
  }
}
