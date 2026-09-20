import { IssueRepository } from "../issue/issue.repository";
import { CommentController } from "./comment.controller";
import { CommentRepository } from "./comment.repository";
import { CommentService } from "./comment.service";

const commentRepository = new CommentRepository();
const issueRepository = new IssueRepository();
const commentService = new CommentService(commentRepository, issueRepository);
export const commentController = new CommentController(commentService);
