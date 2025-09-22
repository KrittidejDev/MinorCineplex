import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const getMany = () => {
  return prisma.coupon.findMany();
};

export const getById = (id: number) => {
  return prisma.coupon.findUnique({ where: { id } });
};
