import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { BoardService } from "./board.service";

export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  createBoard = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id!;
    const { organisationId } = req.params;
    const board = await this.boardService.createBoard(
      userId,
      organisationId as string,
      req.body,
    );
    return res.status(201).json({
      success: true,
      message: "Board created successfully",
      data: board,
    });
  };
  getBoards = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { organisationId } = req.params;
    const boards = await this.boardService.getBoards(
      userId,
      organisationId as string,
    );
    return res.status(200).json({
      success: true,
      data: boards,
    });
  };
  getBoardById = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { organisationId, boardId } = req.params!;
    const board = await this.boardService.getBoardById(
      userId,
      boardId as string,
      organisationId as string,
    );
    return res.status(200).json({
      success: true,
      message: "Board updated successfully",
      data: board,
    });
  };
  updateBoard = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id!;
    const { organisationId, boardId } = req.params;
    const board = await this.boardService.updateBoard(
      userId,
      boardId as string,
      organisationId as string,
      req.body,
    );
    return res.status(200).json({
      success: true,
      message: "Board updated successfully",
      data: board,
    });
  };
  deleteBoard = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { organisationId, boardId } = req.params;
    await this.boardService.deleteBoard(
      userId,
      organisationId as string,
      boardId as string,
    );
    return res.status(200).json({
      success: true,
      message: "Board deleted successfully",
    });
  };
  getSections = async (req: AuthRequest, res: Response) => {
    const boardId = req.params.boardId as string;
    const userId = req.user!.id;
    const sections = await this.boardService.getSections(boardId, userId);
    return res.status(200).json({
      success: true,
      data: sections,
    });
  };
  createSection = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const boardId = req.params.boardId as string;
    const section = await this.boardService.createSection(
      userId,
      boardId,
      req.body,
    );
    return res.status(201).json({
      success: true,
      message: "Section created successfully",
      data: section,
    });
  };
}
