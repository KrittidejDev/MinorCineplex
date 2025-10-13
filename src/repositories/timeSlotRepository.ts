import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const getMany = () => {
  return prisma.time_slot.findMany();
};
