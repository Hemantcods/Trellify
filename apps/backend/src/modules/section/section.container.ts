import { BoardRepository } from "../board/board.repository";
import { SectionController } from "./section.controller";
import { SectionRepository } from "./section.repository";
import { SectionService } from "./section.service";

const sectionRepository = new SectionRepository();
const boardRepository = new BoardRepository();
const sectionService = new SectionService(sectionRepository, boardRepository);
export const sectionController = new SectionController(sectionService);
