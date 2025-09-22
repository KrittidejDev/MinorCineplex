import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const getMany = () => {
  return prisma.movie.findMany();
};
export const getById = (id) => {
  return prisma.movie.findUnique({ where: { id: Number(id) } });
};
