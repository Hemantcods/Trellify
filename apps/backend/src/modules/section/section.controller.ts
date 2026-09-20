import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { SectionService } from "./section.service";

export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  createSection = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const boardId = req.params.boardId as string;
    const section = await this.sectionService.createSection(
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

  updateSection = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const sectionId = req.params.sectionId as string;
    const section = await this.sectionService.updateSection(
      userId,
      sectionId,
      req.body,
    );
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: section,
    });
  };

  deleteSection = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const sectionId = req.params.sectionId as string;
    await this.sectionService.deleteSection(userId, sectionId);
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  };
}
