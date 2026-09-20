import { CreateBoardInput, CreateSectionInput, UpdateOrganisationInput } from "shared";
import { BoardRepository } from "./board.repository";
import { AppError } from "../../errors/AppError";
import { SectionRepository } from "../section/section.repository";

export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly sectionRepository: SectionRepository,
  ) {}
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
  async getSections(boardId: string, userId: string) {
    const hasAccess = await this.boardRepository.userCanAccessBoard(
      userId,
      boardId,
    );
    if (!hasAccess) {
      throw new AppError(
        "Board not found or you do not have access to this board",
        404,
      );
    }
    return this.sectionRepository.getSections(boardId);
  }
  async createSection(userId: string, boardId: string, data: CreateSectionInput) {
    const hasAccess = await this.boardRepository.userCanAccessBoard(
      userId,
      boardId,
    );
    if (!hasAccess) {
      throw new AppError(
        "Board not found or you do not have access to this board",
        404,
      );
    }
    const lastSection = await this.sectionRepository.getLastPosition(boardId);
    const position = lastSection !== null ? lastSection + 1 : 0;
    return this.sectionRepository.createSection({
      ...data,
      boardId,
      position,
    });
  }
}
