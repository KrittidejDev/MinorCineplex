import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const getMany = () => {
  return prisma.movie.findMany();
};
export const getById = (id: string) => {
  return prisma.movie.findUnique({ where: { id } });
};
