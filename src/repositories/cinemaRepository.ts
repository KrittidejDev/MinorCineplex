import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const getMany = () => {
  return prisma.cinema.findMany();
};

export const getByID = (id: string) => {
  return prisma.cinema.findUnique({ where: { id } });
};

export const getByIDDetail = async (id: string) => {
  return await prisma.cinema.findUnique({
    where: { id },
    include: {
      halls: {
        include: {
          seats: true,
          showtimes: {
            include: {
              movie: true,
              time_slot: true,
              seats: true,
            },
          },
        },
      },
    },
  });
};
