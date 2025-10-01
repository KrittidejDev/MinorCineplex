import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const getByMovies = (movie_id: string) => {
  return prisma.cinema.findMany({
    where: {
      halls: {
        some: {
          showtimes: {
            some: {
              movie_id: movie_id,
            },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      name_en: true,
      halls: {
        where: {
          showtimes: {
            some: {
              movie_id: movie_id,
            },
          },
        },
        select: {
          id: true,
          name: true,
          showtimes: {
            where: {
              movie_id: movie_id,
            },
            select: {
              id: true,
              date: true,
              price: true,
              movie: {
                select: {
                  id: true,
                  title: true,
                  poster_url: true,
                  release_date: true,
                  description: true,
                  duration_min: true,
                  genre: true,
                },
              },
              time_slot: {
                select: {
                  id: true,
                  start_time: true,
                  end_time: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const getAll = () => {
  return prisma.cinema.findMany();
};

export const getByID = (id: string) => {
  return prisma.cinema.findUnique({ where: { id } });
};

export const cinemaRepo = {
  getByIDDetail: async (id: string) => {
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
  },
};
