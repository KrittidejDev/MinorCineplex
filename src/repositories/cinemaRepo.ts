import { PrismaClient, Prisma } from "@/generated/prisma";
import { CinemaDTO, CinemaFilters, Pagination } from "@/types/cinema";

const prisma = new PrismaClient();

export const cinemaRepo = {
  async findCinemas(
    filters?: CinemaFilters,
    pagination?: Pagination
  ): Promise<{ data: CinemaDTO[]; count: number }> {
    const { city, group, name } = filters || {};
    const { page = 1, limit = 1000 } = pagination || {};

    const where: Prisma.CinemaWhereInput = {};

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (group) {
      where.group = { contains: group, mode: "insensitive" };
    }

    if (name) {
      where.name = { contains: name, mode: "insensitive" };
    }

    const [data, count] = await Promise.all([
      prisma.cinema.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.cinema.count({ where }),
    ]);

    return { data: data as CinemaDTO[], count };
  },

  async findCinemaBySlug(slug: string): Promise<CinemaDTO | null> {
    const cinema = await prisma.cinema.findUnique({
      where: { slug },
    });
    return cinema as CinemaDTO | null;
  },

  async findCinemaById(id: string): Promise<CinemaDTO | null> {
    const cinema = await prisma.cinema.findUnique({
      where: { id },
    });
    return cinema as CinemaDTO | null;
  },
  async findCinemasForAdmin(): Promise<CinemaDTO[]> {
    const cinemas = await prisma.cinema.findMany({
      include: {
        halls: true,
      },
    });
    return cinemas as unknown as CinemaDTO[];
  },
};
