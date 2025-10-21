import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const getMany = () => {
  return prisma.timeSlot.findMany();
};

export const getTimeSlotById = async (id: string) => {
  return prisma.timeSlot.findUnique({
    where: { id },
  });
};

