import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const getMany = () => {
  return prisma.cinema.findMany();
};

export const getByID = (id) => {
  return prisma.cinema.findUnique({where: {
    id: Number(id),
  }});
};


