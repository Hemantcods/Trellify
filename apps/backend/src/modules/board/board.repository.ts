import { MembershipRoles, prisma } from "db/client";
import { CreateBoardInput, UpdateOrganisationInput } from "shared";
import { AppError } from "../../errors/AppError";

export class BoardRepository {
  async createBoard(
    userId: string,
    data: CreateBoardInput & { organisationId: string },
  ) {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organisationId: {
          userId,
          organisationId: data.organisationId,
        },
      },
    });
    if (!membership) {
      throw new AppError("You are not a member of this organisation", 403);
    }
    if (membership.role !== MembershipRoles.OWNER && membership.role !== MembershipRoles.ADMIN) {
      throw new AppError("You do not have permission to create a board", 403);
    }
    return prisma.board.create({
      data,
    });
  }
  async updateBoard(
    userId: string,
    boardId: string,
    data: UpdateOrganisationInput & { organisationId: string },
  ) {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organisationId: {
          userId,
          organisationId: data.organisationId,
        },
      },
    });
    if (!membership) {
      throw new AppError("You are not a member of this organisation", 403);
    }
    if (membership.role !== MembershipRoles.OWNER && membership.role !== MembershipRoles.ADMIN) {
      throw new AppError(
        "You do not have permission to update this board",
        403,
      );
    }
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        organisationId: data.organisationId,
      },
    });

    if (!board) {
      throw new AppError("Board not found", 404);
    }
    return prisma.board.update({
      where: {
        id: boardId,
      },
      data,
    });
  }
  async findBoardByOrgId(userId: string, organisationId: string) {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organisationId: {
          userId,
          organisationId,
        },
      },
    });
    if (!membership) {
      throw new AppError("You are not a member of this organisation", 403);
    }
    return prisma.board.findMany({
      where: {
        organisationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
  async findBoardByOrgIdandBoardId(
    userId: string,
    boardId: string,
    organisationId: string,
  ) {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organisationId: {
          userId,
          organisationId,
        },
      },
    });
    if (!membership) {
      throw new AppError("You are not a member of this organisation", 403);
    }
    return prisma.board.findFirst({
      where: {
        id: boardId,
        organisationId,
      },
    });
  }
  async deleteBoard(userId: string, organisationId: string, boardId: string) {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organisationId: {
          userId,
          organisationId,
        },
      },
    });
    if (!membership) {
      throw new AppError("You are not a member of this organisation", 403);
    }
    if (membership.role !== MembershipRoles.OWNER && membership.role !== MembershipRoles.ADMIN) {
      throw new AppError(
        "You do not have permission to delete this board",
        403,
      );
    }
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        organisationId,
      },
    });

    if (!board) {
      throw new AppError("Board not found", 404);
    }
    return prisma.board.delete({
      where: {
        id: boardId,
      },
    });
  }
  async findBoardById(boardId: string) {
    return prisma.board.findFirst({
      where: {
        id: boardId,
      },
    });
  }
  async userCanAccessBoard(userId: string, boardId: string) {
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        organisation: {
          memberships: {
            some: {
              userId,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    return !!board;
  }
}
