import { prisma } from "db/client";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    return prisma.user.create({
      data,
    });
  }
  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }
  async findUserByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: {
        googleId,
      },
    });
  }
  async linkGoogleAccount(userId: string, googleId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        googleId,
      },
    });
  }
  async createGoogleUser(data: {
    name: string;
    email: string;
    googleId: string;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        googleId: data.googleId,
      },
    });
  }
  async updateRefreshToken(userId: string, refreshToken: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken,
      },
    });
  }
}
