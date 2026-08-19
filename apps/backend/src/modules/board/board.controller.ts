import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { BoardService } from "./board.service";

export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  async createBoard(req: AuthRequest, res: Response) {
    const userId = req.user?.id!;
    const organisationId = req.params.id as string;
    const board = await this.boardService.createBoard(
      userId,
      organisationId,
      req.body,
    );
    return res.status(201).json({
      success: true,
      message: "Board created successfully",
      data: board,
    });
  }
  async getBoards(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const organisationId = req.params.id as string;
    const boards = await this.boardService.getBoards(userId, organisationId);
    return res.status(200).json({
      success: true,
      data: boards,
    });
  }
  async getBoardById(req: AuthRequest, res: Response) {
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
  }
  async deletteBoard(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const { organisationId, boardId } = req.params;
    await this.boardService.deleteBoard(userId, organisationId as string, boardId as string)
  }
}
