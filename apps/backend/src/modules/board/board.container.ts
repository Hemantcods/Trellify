import { SectionRepository } from "../section/section.repository";
import { BoardController } from "./board.controller";
import { BoardRepository } from "./board.repository";
import { BoardService } from "./board.service";

const boardRepository = new BoardRepository();
const sectionRepository = new SectionRepository();
const boardService = new BoardService(boardRepository, sectionRepository);
export const boardController = new BoardController(boardService);
