import { BoardRepository } from "../board/board.repository";
import { SectionRepository } from "../section/section.repository";
import { IssueController } from "./issue.controller";
import { IssueRepository } from "./issue.repository";
import { IssueService } from "./issue.service";

const issueRepository = new IssueRepository();
const boardRepository = new BoardRepository();
const sectionRepository = new SectionRepository();
const issueService = new IssueService(issueRepository, boardRepository, sectionRepository);
export const issueController = new IssueController(issueService);
