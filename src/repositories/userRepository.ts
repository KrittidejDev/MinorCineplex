import { PrismaClient } from "@/generated/prisma";
import { UpdateUserInput } from "../types/user";

const prisma = new PrismaClient();

export const getMany = () => {
  return prisma.user.findMany();
};

export const getByID = (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};
export const updateUser = (id: string, data: UpdateUserInput) => {
  return prisma.user.update({ where: { id }, data });
};