import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { IssueService } from "./issue.service";

export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  createIssue = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const sectionId = req.params.sectionId as string;
    const issue = await this.issueService.createIssue(userId, sectionId, req.body);
    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  };

  getIssuesByBoard = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const boardId = req.params.boardId as string;
    const issues = await this.issueService.getIssuesByBoard(userId, boardId);
    return res.status(200).json({
      success: true,
      data: issues,
    });
  };

  getIssueById = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const issueId = req.params.issueId as string;
    const issue = await this.issueService.getIssueById(userId, issueId);
    return res.status(200).json({
      success: true,
      data: issue,
    });
  };

  updateIssue = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const issueId = req.params.issueId as string;
    const issue = await this.issueService.updateIssue(userId, issueId, req.body);
    return res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: issue,
    });
  };

  deleteIssue = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const issueId = req.params.issueId as string;
    await this.issueService.deleteIssue(userId, issueId);
    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  };

  addAssignee = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const issueId = req.params.issueId as string;
    await this.issueService.addAssignee(userId, issueId, req.body);
    return res.status(200).json({
      success: true,
      message: "Assignee added successfully",
    });
  };

  removeAssignee = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const issueId = req.params.issueId as string;
    const assigneeId = req.params.userId as string;
    await this.issueService.removeAssignee(userId, issueId, assigneeId);
    return res.status(200).json({
      success: true,
      message: "Assignee removed successfully",
    });
  };

  reorderIssues = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const sectionId = req.params.sectionId as string;
    await this.issueService.reorderIssues(userId, sectionId, req.body);
    return res.status(200).json({
      success: true,
      message: "Issues reordered successfully",
    });
  };

  reorderSections = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const boardId = req.params.boardId as string;
    await this.issueService.reorderSections(userId, boardId, req.body);
    return res.status(200).json({
      success: true,
      message: "Sections reordered successfully",
    });
  };
}
