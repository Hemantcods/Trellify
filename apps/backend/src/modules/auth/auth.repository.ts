import { prisma } from "db/client";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: {
    name: string,
    email: string,
    passwordHash:string
  }) {
    return prisma.user.create({
      data
    })
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where:{id}
    })
  }
}
