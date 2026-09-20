import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { CommentService } from "./comment.service";

export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  createComment = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const issueId = req.params.issueId as string;
    const comment = await this.commentService.createComment(userId, issueId, req.body);
    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  };

  getCommentsByIssue = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const issueId = req.params.issueId as string;
    const comments = await this.commentService.getCommentsByIssue(userId, issueId);
    return res.status(200).json({
      success: true,
      data: comments,
    });
  };

  deleteComment = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const commentId = req.params.commentId as string;
    await this.commentService.deleteComment(userId, commentId);
    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  };
}
