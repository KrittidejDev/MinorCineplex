import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserByPhone = (phone: string) => {
  return prisma.user.findUnique({ where: { phone } });
};

export const findUserByUsername = (username: string, id?: string) => {
  if (id) {
    // For update operations - check username exists for other users
    return prisma.user.findUnique({ where: {
      username: username,
      NOT: {
        id: id,
      },
    },
  });
  } else {
    // For registration - check if username already exists
    return prisma.user.findUnique({ where: { username } });
  }
}

export const createUser = (data: {
  username: string;
  phone: string;
  email: string;
  password: string;
  role: "CUSTOMER";
}) => {
  return prisma.user.create({ data });
};

export const findUserById = (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const updateUser = (id: string, data: { password: string }) => {
  return prisma.user.update({ where: { id }, data });
};
