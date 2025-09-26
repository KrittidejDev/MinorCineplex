import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const getMany = () => {
  return prisma.coupon.findMany();
};

export const getById = (id: number) => {
  return prisma.coupon.findUnique({ where: { id } });
};

export const create = (data: {
  code: string;
  discount: number;
  expiresAt: Date;
}) => {
  return prisma.coupon.create({ data });
};