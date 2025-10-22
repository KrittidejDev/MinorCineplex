import { PrismaClient, Prisma } from "@/generated/prisma";
import { CinemaFromAPI } from "@/types/adminShowtime";
import {
  CinemaDTO,
  CinemaFilters,
  MovieWithHalls,
  MovieDTO,
  Pagination,
  HallWithShowtimes,
  ShowtimeWithRelations,
  Genre,
} from "@/types/cinema";

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

  async findCinemaShowtimesBySlug(
    slug: string,
    date: Date
  ): Promise<MovieWithHalls[] | null> {
    // ค้นหาโรงภาพยนตร์ตาม slug
    const cinema = await prisma.cinema.findUnique({
      where: { slug },
      include: {
        halls: {
          select: {
            id: true,
            slug: true,
            name: true,
            seat_count: true,
            cinema_id: true,
            created_at: true,
            updated_at: true,
          },
        },
        showtimes: {
          where: {
            date: {
              gte: new Date(date.setHours(0, 0, 0, 0)),
              lte: new Date(date.setHours(23, 59, 59, 999)),
            },
          },
          include: {
            movie: {
              include: {
                genres: {
                  include: {
                    genre: {
                      select: {
                        id: true,
                        slug: true,
                        name: true,
                        translations: true,
                        created_at: true,
                        updated_at: true,
                      },
                    },
                  },
                },
              },
            },
            hall: {
              select: {
                id: true,
                slug: true,
                name: true,
                seat_count: true,
                cinema_id: true,
                created_at: true,
                updated_at: true,
              },
            },
            time_slot: {
              select: {
                id: true,
                name: true,
                start_time: true,
                end_time: true,
                created_at: true,
                updated_at: true,
              },
            },
          },
        },
      },
    });

    if (!cinema) {
      return null;
    }

    // ดึงรายการภาพยนตร์ทั้งหมดที่ฉายในโรงนี้ในวันที่ระบุ
    const movies = await prisma.movie.findMany({
      where: {
        showtimes: {
          some: {
            cinema_id: cinema.id,
            date: {
              gte: new Date(date.setHours(0, 0, 0, 0)),
              lte: new Date(date.setHours(23, 59, 59, 999)),
            },
          },
        },
      },
      include: {
        genres: {
          include: {
            genre: {
              select: {
                id: true,
                slug: true,
                name: true,
                translations: true,
                created_at: true,
                updated_at: true,
              },
            },
          },
        },
      },
    });

    // จัดโครงสร้างผลลัพธ์ตามลำดับที่ต้องการ
    const result: MovieWithHalls[] = movies.map((movie) => {
      // แปลง translations ให้ตรงกับประเภทที่คาดหวัง
      const translations = movie.translations
        ? (movie.translations as Record<
            string,
            { title: string; description?: string }
          >)
        : null;

      // แปลง genres ให้ตรงกับประเภท Genre
      const genres: Genre[] = movie.genres.map((mg) => ({
        id: mg.genre.id,
        slug: mg.genre.slug,
        name: mg.genre.name,
        translations: mg.genre.translations as Record<
          string,
          { name: string }
        > | null,
        created_at: mg.genre.created_at,
        updated_at: mg.genre.updated_at,
      }));

      // ดึงรอบฉายที่เกี่ยวข้องกับภาพยนตร์นี้
      const movieShowtimes = cinema.showtimes.filter(
        (showtime) => showtime.movie_id === movie.id
      );

      // จัดกลุ่มรอบฉายตามห้องฉาย
      const hallsMap = new Map<string, HallWithShowtimes>();
      movieShowtimes.forEach((showtime) => {
        const hall = showtime.hall;
        if (!hallsMap.has(hall.id)) {
          hallsMap.set(hall.id, {
            id: hall.id,
            slug: hall.slug,
            name: hall.name,
            seat_count: hall.seat_count,
            cinema_id: hall.cinema_id,
            created_at: hall.created_at,
            updated_at: hall.updated_at,
            showtimes: [],
          });
        }
        hallsMap.get(hall.id)!.showtimes.push({
          id: showtime.id,
          price: showtime.price,
          date: showtime.date,
          timeslot: {
            id: showtime.time_slot.id,
            name: showtime.time_slot.name,
            start_time: showtime.time_slot.start_time,
            end_time: showtime.time_slot.end_time,
            created_at: showtime.time_slot.created_at,
            updated_at: showtime.time_slot.updated_at,
          },
        });
      });

      // เรียงลำดับ showtimes ตาม start_time
      hallsMap.forEach((hall) => {
        hall.showtimes.sort((a, b) =>
          a.timeslot.start_time.localeCompare(b.timeslot.start_time)
        );
      });

      return {
        movie: {
          id: movie.id,
          slug: movie.slug,
          title: movie.title,
          translations,
          duration_min: movie.duration_min,
          poster_url: movie.poster_url,
          trailer_url: movie.trailer_url,
          rating: movie.rating,
          release_date: movie.release_date,
          status: movie.status,
          created_at: movie.created_at,
          updated_at: movie.updated_at,
          genres,
        } as MovieDTO,
        halls: Array.from(hallsMap.values()),
      };
    });

    return result;
  },
  async getCinemasForDropdown(): Promise<CinemaFromAPI[]> {
    const cinemas = await prisma.cinema.findMany({
      include: {
        halls: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    return cinemas;
  },
};

