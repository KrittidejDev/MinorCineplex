import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const getMany = () => {
  return prisma.user.findMany();
};

export const getByID = (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};
