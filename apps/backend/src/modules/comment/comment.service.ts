import { CreateCommentInput } from "shared";
import { AppError } from "../../errors/AppError";
import { IssueRepository } from "../issue/issue.repository";
import { CommentRepository } from "./comment.repository";

export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly issueRepository: IssueRepository,
  ) {}

  async createComment(userId: string, issueId: string, data: CreateCommentInput) {
    const issue = await this.issueRepository.getIssueById(issueId);
    if (!issue) {
      throw new AppError("Issue not found", 404);
    }

    return this.commentRepository.createComment({
      ...data,
      issueId,
      userId,
    });
  }

  async getCommentsByIssue(userId: string, issueId: string) {
    const issue = await this.issueRepository.getIssueById(issueId);
    if (!issue) {
      throw new AppError("Issue not found", 404);
    }

    return this.commentRepository.getCommentsByIssue(issueId);
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.commentRepository.getCommentById(commentId);
    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (comment.userId !== userId) {
      throw new AppError("You can only delete your own comments", 403);
    }

    return this.commentRepository.deleteComment(commentId);
  }
}
