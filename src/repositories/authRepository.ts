import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserByPhone = (phone: string) => {
  return prisma.user.findUnique({ where: { phone } });
};

export const createUser = (data: {
  username: string;
  phone: string;
  email: string;
  password: string;
  role: "CUSTOMER";
}) => {
  return prisma.user.create({ data });
};