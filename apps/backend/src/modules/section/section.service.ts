import { CreateSectionInput, UpdateSectionInput } from "shared";
import { AppError } from "../../errors/AppError";
import { BoardRepository } from "../board/board.repository";
import { SectionRepository } from "./section.repository";

export class SectionService {
  constructor(
    private readonly sectionRepository: SectionRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  async createSection(
    userId: string,
    boardId: string,
    data: CreateSectionInput,
  ) {
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

  async updateSection(
    userId: string,
    sectionId: string,
    data: UpdateSectionInput,
  ) {
    const section = await this.sectionRepository.getSectionById(sectionId);
    if (!section) {
      throw new AppError("Section not found", 404);
    }

    const hasAccess = await this.boardRepository.userCanAccessBoard(
      userId,
      section.boardId,
    );
    if (!hasAccess) {
      throw new AppError(
        "Board not found or you do not have access to this board",
        404,
      );
    }

    return this.sectionRepository.updateSection(sectionId, data);
  }

  async deleteSection(userId: string, sectionId: string) {
    const section = await this.sectionRepository.getSectionById(sectionId);
    if (!section) {
      throw new AppError("Section not found", 404);
    }

    const hasAccess = await this.boardRepository.userCanAccessBoard(
      userId,
      section.boardId,
    );
    if (!hasAccess) {
      throw new AppError(
        "Board not found or you do not have access to this board",
        404,
      );
    }

    return this.sectionRepository.deleteSection(sectionId);
  }
}
