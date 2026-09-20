import { prisma } from "db/client";
import { CreateIssueInput, UpdateIssueInput } from "shared";

export class IssueRepository {
  async createIssue(data: CreateIssueInput & { boardId: string; sectionId: string; position: number }) {
    return prisma.issue.create({ data });
  }

  async getIssuesByBoard(boardId: string) {
    return prisma.issue.findMany({
      where: { boardId },
      orderBy: { position: "asc" },
      include: {
        assignees: {
          select: { userId: true },
        },
      },
    });
  }

  async getIssueById(issueId: string) {
    return prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        assignees: {
          select: { userId: true },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async updateIssue(issueId: string, data: UpdateIssueInput) {
    return prisma.issue.update({
      where: { id: issueId },
      data,
    });
  }

  async deleteIssue(issueId: string) {
    return prisma.issue.delete({
      where: { id: issueId },
    });
  }

  async getLastPosition(sectionId: string) {
    const lastIssue = await prisma.issue.findFirst({
      where: { sectionId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    return lastIssue?.position ?? null;
  }

  async addAssignee(issueId: string, userId: string) {
    return prisma.issueAssignee.create({
      data: { issueId, userId },
    });
  }

  async removeAssignee(issueId: string, userId: string) {
    return prisma.issueAssignee.delete({
      where: { userId_issueId: { userId, issueId } },
    });
  }

  async reorderIssues(sectionId: string, issueIds: string[]) {
    const updates = issueIds.map((id, index) =>
      prisma.issue.update({
        where: { id },
        data: { position: index, sectionId },
      })
    );
    return prisma.$transaction(updates);
  }

  async moveIssue(issueId: string, newSectionId: string, newPosition: number) {
    return prisma.issue.update({
      where: { id: issueId },
      data: { sectionId: newSectionId, position: newPosition },
    });
  }

  async reorderSections(boardId: string, sectionIds: string[]) {
    const updates = sectionIds.map((id, index) =>
      prisma.section.update({
        where: { id },
        data: { position: index },
      })
    );
    return prisma.$transaction(updates);
  }
}
