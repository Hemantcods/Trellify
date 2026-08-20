import { BoardController } from "./board.controller";
import { BoardRepository } from "./board.repository";
import { BoardService } from "./board.service";

const boardRepository =new BoardRepository()
const boardService = new BoardService(boardRepository)
export const boardController= new BoardController(boardService)