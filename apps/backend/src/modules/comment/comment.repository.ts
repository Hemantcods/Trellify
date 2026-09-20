import { prisma } from "db/client";

export class CommentRepository {
  async createComment(data: { content: string; issueId: string; userId: string }) {
    return prisma.comment.create({
      data,
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async getCommentsByIssue(issueId: string) {
    return prisma.comment.findMany({
      where: { issueId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async getCommentById(commentId: string) {
    return prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async deleteComment(commentId: string) {
    return prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
