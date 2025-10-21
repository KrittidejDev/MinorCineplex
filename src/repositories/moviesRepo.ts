import { PrismaClient, Prisma } from "@/generated/prisma";
import { MovieDTO, MovieFilters, Pagination, ShowtimeDTO } from "@/types/movie";
import { startOfDay, format, endOfDay } from "date-fns";
import { th } from "date-fns/locale";

const prisma = new PrismaClient();

export const moviesRepo = {
  async findMovies(
    filters: MovieFilters,
    pagination?: Pagination
  ): Promise<{ data: MovieDTO[]; count: number }> {
    const { title, language, genre, release_date, status } = filters;
    const { page = 1, limit = 1000 } = pagination || {};
    const today = new Date();
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const where: Prisma.MovieWhereInput = {};

    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }

    if (language) {
      where.languages = { some: { language: { code: language } } };
    }

    if (genre) {
      where.genres = { some: { genre: { slug: genre } } };
    }

    if (release_date) {
      where.release_date = new Date(release_date);
    }

    if (status === "NOW_SHOWING") {
      where.release_date = { lte: today };
    } else if (status === "COMING_SOON") {
      where.release_date = { gte: tomorrow };
    }

    const orderBy: Prisma.MovieOrderByWithRelationInput = !status
      ? { release_date: "desc" }
      : status === "NOW_SHOWING"
        ? { release_date: "desc" }
        : { release_date: "asc" };

    const [data, count] = await Promise.all([
      prisma.movie.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          genres: { include: { genre: true } },
          languages: { include: { language: true } },
          actors: { include: { actor: true } },
          directors: { include: { director: true } },
        },
      }),
      prisma.movie.count({ where }),
    ]);

    return { data: data as MovieDTO[], count };
  },

  async findMovieById(id: string): Promise<MovieDTO | null> {
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        genres: { include: { genre: true } },
        languages: { include: { language: true } },
        actors: { include: { actor: true } },
        directors: { include: { director: true } },
      },
    });
    return movie as MovieDTO | null;
  },

  async findMovieBySlug(slug: string): Promise<MovieDTO | null> {
    const movie = await prisma.movie.findUnique({
      where: { slug },
      include: {
        genres: { include: { genre: true } },
        languages: { include: { language: true } },
        actors: { include: { actor: true } },
        directors: { include: { director: true } },
      },
    });
    return movie as MovieDTO | null;
  },

  async findMovieShowtimes(
    slug: string,
    date?: string
  ): Promise<ShowtimeDTO[]> {
    const movie = await prisma.movie.findUnique({
      where: { slug },
      select: { id: true, slug: true, title: true },
    });

    if (!movie) return [];

    const where: Prisma.ShowtimeWhereInput = {
      movie_id: movie.id,
    };

    if (date) {
      try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date format");
        }
        // ฟิลเตอร์รอบฉายในวันที่เลือก (เฉพาะวันที่ ไม่รวมเวลา)
        where.date = {
          gte: startOfDay(parsedDate),
          lte: endOfDay(parsedDate),
        };
      } catch (error) {
        console.error("Invalid date parameter:", date, error);
        return [];
      }
    }

    const showtimes = await prisma.showtime.findMany({
      where,
      include: {
        cinema: {
          select: {
            id: true,
            slug: true,
            name: true,
            translations: true,
            address: true,
            city: true,
          },
        },
        hall: {
          select: {
            id: true,
            slug: true,
            name: true,
            seat_count: true,
          },
        },
        showtime_seats: {
          select: { status: true },
        },
        time_slot: {
          select: {
            id: true,
            name: true,
            start_time: true,
            end_time: true,
          },
        },
      },
      orderBy: [
        { cinema: { name: "asc" } },
        { hall: { name: "asc" } },
        { date: "asc" },
        { time_slot: { start_time: "asc" } },
      ],
    });

    if (!showtimes.length) return [];

    // --- Group showtimes ---
    type ShowtimeAcc = Record<
      string,
      {
        cinema: ShowtimeDTO["cinema"];
        halls: Record<
          string,
          {
            hall: ShowtimeDTO["halls"][0]["hall"];
            showtimes: ShowtimeDTO["halls"][0]["showtimes"];
          }
        >;
      }
    >;

    const groupedShowtimes = showtimes.reduce((acc: ShowtimeAcc, showtime) => {
      const cinema = showtime.cinema!;
      const hall = showtime.hall!;
      const timeSlot = showtime.time_slot!;
      const totalSeats = hall?.seat_count ?? 0;

      const availableSeats = (showtime.showtime_seats ?? []).filter(
        (seat) => seat.status === "AVAILABLE"
      ).length;

      if (!acc[cinema.id]) {
        acc[cinema.id] = {
          cinema: {
            id: cinema.id,
            slug: cinema.slug,
            name: cinema.name,
            name_en:
              typeof cinema.translations === "object" &&
              cinema.translations !== null
                ? (cinema.translations as Record<string, string>)?.en ||
                  cinema.name
                : cinema.name,
            address: cinema.address,
            city: cinema.city || undefined,
          },
          halls: {},
        };
      }

      if (!acc[cinema.id].halls[hall.id]) {
        acc[cinema.id].halls[hall.id] = {
          hall: {
            id: hall.id,
            slug: hall.slug,
            name: hall.name,
            seat_count: hall.seat_count,
          },
          showtimes: [],
        };
      }

      acc[cinema.id].halls[hall.id].showtimes.push({
        id: showtime.id,
        date: showtime.date,
        price: showtime.price,
        available_seats: availableSeats,
        total_seats: totalSeats,
        time_slot: {
          id: timeSlot.id,
          name: timeSlot.name,
          start_time: timeSlot.start_time,
          end_time: timeSlot.end_time,
        },
      });

      return acc;
    }, {} as ShowtimeAcc);

    const groupedValues = Object.values(groupedShowtimes);

    return groupedValues.map((cinemaData) => ({
      cinema: cinemaData.cinema,
      halls: Object.values(cinemaData.halls).map((hallData) => ({
        hall: hallData.hall,
        showtimes: hallData.showtimes,
      })),
    })) as ShowtimeDTO[];
  },

  async updateMovieStatusToNowShowing(): Promise<number> {
    try {
      const today = startOfDay(new Date()); // วันที่ปัจจุบัน (00:00:00 UTC+07:00)

      const updatedMovies = await prisma.movie.updateMany({
        where: {
          status: "COMING_SOON",
          release_date: {
            lte: today, // รวม release_date ที่เก่ากว่าหรือเท่ากับวันนี้
          },
        },
        data: {
          status: "NOW_SHOWING",
        },
      });

      if (updatedMovies.count > 0) {
        console.log(
          `Updated ${updatedMovies.count} movies to NOW_SHOWING on ${format(
            today,
            "yyyy-MM-dd",
            { locale: th }
          )}`
        );
      }

      return updatedMovies.count;
    } catch (error) {
      console.error("Error updating movie status:", error);
      throw new Error("Failed to update movie status");
    }
  },
  async findMoviesForAdmin(): Promise<MovieDTO[]> {
    const movies = await prisma.movie.findMany();
    return movies as unknown as MovieDTO[];
  },
};
