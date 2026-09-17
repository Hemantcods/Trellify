import { prisma } from "db/client";
import { CreateSectionInput, UpdateSectionInput } from "shared";

export class SectionRepository {
  async getSections(boardId: string) {
    return prisma.section.findMany({
      where: {
        boardId,
      },
      orderBy: {
        position: "asc",
      },
      select: {
        id: true,
        title: true,
        position: true,
        issues: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            title: true,
            description: true,
            position: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async getSectionById(sectionId: string) {
    return prisma.section.findUnique({
      where: {
        id: sectionId,
      },
    });
  }

  async getLastPosition(boardId: string) {
    const lastSection = await prisma.section.findFirst({
      where: {
        boardId,
      },
      orderBy: {
        position: "desc",
      },
      select: {
        position: true,
      },
    });
    return lastSection?.position ?? null;
  }

  async createSection(data: CreateSectionInput & { boardId: string; position: number }) {
    return prisma.section.create({
      data,
    });
  }

  async updateSection(sectionId: string, data: UpdateSectionInput) {
    return prisma.section.update({
      where: {
        id: sectionId,
      },
      data,
    });
  }

  async deleteSection(sectionId: string) {
    return prisma.section.delete({
      where: {
        id: sectionId,
      },
    });
  }
}
