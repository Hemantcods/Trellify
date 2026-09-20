import { CreateIssueInput, UpdateIssueInput, ReorderInput, AssigneeInput } from "shared";
import { AppError } from "../../errors/AppError";
import { BoardRepository } from "../board/board.repository";
import { SectionRepository } from "../section/section.repository";
import { IssueRepository } from "./issue.repository";

export class IssueService {
  constructor(
    private readonly issueRepository: IssueRepository,
    private readonly boardRepository: BoardRepository,
    private readonly sectionRepository: SectionRepository,
  ) {}

  async createIssue(userId: string, sectionId: string, data: CreateIssueInput) {
    const section = await this.sectionRepository.getSectionById(sectionId);
    if (!section) {
      throw new AppError("Section not found", 404);
    }

    const hasAccess = await this.boardRepository.userCanAccessBoard(userId, section.boardId);
    if (!hasAccess) {
      throw new AppError("Board not found or you do not have access", 404);
    }

    const lastPosition = await this.issueRepository.getLastPosition(sectionId);
    const position = lastPosition !== null ? lastPosition + 1 : 0;

    const issue = await this.issueRepository.createIssue({
      ...data,
      boardId: section.boardId,
      sectionId,
      position,
    });

    return { ...issue, assignees: [] };
  }

  async getIssuesByBoard(userId: string, boardId: string) {
    const hasAccess = await this.boardRepository.userCanAccessBoard(userId, boardId);
    if (!hasAccess) {
      throw new AppError("Board not found or you do not have access", 404);
    }

    const issues = await this.issueRepository.getIssuesByBoard(boardId);
    return issues.map((issue) => ({
      ...issue,
      assignees: issue.assignees.map((a) => a.userId),
    }));
  }

  async getIssueById(userId: string, issueId: string) {
    const issue = await this.issueRepository.getIssueById(issueId);
    if (!issue) {
      throw new AppError("Issue not found", 404);
    }

    const hasAccess = await this.boardRepository.userCanAccessBoard(userId, issue.boardId);
    if (!hasAccess) {
      throw new AppError("Board not found or you do not have access", 404);
    }

    return {
      ...issue,
      assignees: issue.assignees.map((a) => a.userId),
    };
  }

  async updateIssue(userId: string, issueId: string, data: UpdateIssueInput) {
    const issue = await this.issueRepository.getIssueById(issueId);
    if (!issue) {
      throw new AppError("Issue not found", 404);
    }

    const hasAccess = await this.boardRepository.userCanAccessBoard(userId, issue.boardId);
    if (!hasAccess) {
      throw new AppError("Board not found or you do not have access", 404);
    }

    return this.issueRepository.updateIssue(issueId, data);
  }

  async deleteIssue(userId: string, issueId: string) {
    const issue = await this.issueRepository.getIssueById(issueId);
    if (!issue) {
      throw new AppError("Issue not found", 404);
    }

    const hasAccess = await this.boardRepository.userCanAccessBoard(userId, issue.boardId);
    if (!hasAccess) {
      throw new AppError("Board not found or you do not have access", 404);
    }

    return this.issueRepository.deleteIssue(issueId);
  }

  async addAssignee(userId: string, issueId: string, input: AssigneeInput) {
    const issue = await this.issueRepository.getIssueById(issueId);
    if (!issue) {
      throw new AppError("Issue not found", 404);
    }

    const hasAccess = await this.boardRepository.userCanAccessBoard(userId, issue.boardId);
    if (!hasAccess) {
      throw new AppError("Board not found or you do not have access", 404);
    }

    return this.issueRepository.addAssignee(issueId, input.userId);
  }

  async removeAssignee(userId: string, issueId: string, assigneeId: string) {
    const issue = await this.issueRepository.getIssueById(issueId);
    if (!issue) {
      throw new AppError("Issue not found", 404);
    }

    const hasAccess = await this.boardRepository.userCanAccessBoard(userId, issue.boardId);
    if (!hasAccess) {
      throw new AppError("Board not found or you do not have access", 404);
    }

    return this.issueRepository.removeAssignee(issueId, assigneeId);
  }

  async reorderIssues(userId: string, sectionId: string, input: ReorderInput) {
    const section = await this.sectionRepository.getSectionById(sectionId);
    if (!section) {
      throw new AppError("Section not found", 404);
    }

    const hasAccess = await this.boardRepository.userCanAccessBoard(userId, section.boardId);
    if (!hasAccess) {
      throw new AppError("Board not found or you do not have access", 404);
    }

    return this.issueRepository.reorderIssues(sectionId, input.itemIds);
  }

  async reorderSections(userId: string, boardId: string, input: ReorderInput) {
    const hasAccess = await this.boardRepository.userCanAccessBoard(userId, boardId);
    if (!hasAccess) {
      throw new AppError("Board not found or you do not have access", 404);
    }

    return this.issueRepository.reorderSections(boardId, input.itemIds);
  }
}
