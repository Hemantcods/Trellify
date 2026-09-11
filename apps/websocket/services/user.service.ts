import { prisma } from "db/client";
export async function getUsersPresence(userIds: string[]) {
  if (userIds.length == 0) return [];
  return prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
}
export async function findUser(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
    },
  });
}
