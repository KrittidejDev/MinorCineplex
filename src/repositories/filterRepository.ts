import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const findGenres = () => {
  return prisma.genre.findMany();
};