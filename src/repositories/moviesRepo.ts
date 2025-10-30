import { PrismaClient, Prisma } from "@/generated/prisma";
import { MovieDTO, MovieFilters, Pagination, ShowtimeDTO } from "@/types/movie";
import { startOfDay, endOfDay } from "date-fns";
import { MovieStatus } from "@/generated/prisma";

const prisma = new PrismaClient();

export const moviesRepo = {
  async findMovies(
    filters: MovieFilters,
    pagination?: Pagination
  ): Promise<{ data: MovieDTO[]; count: number }> {
    const { movie_id, title, language, genre, release_date, status } = filters;
    const { page = 1, limit = 1000 } = pagination || {};
    const today = new Date();
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const where: Prisma.MovieWhereInput = {};

    // Filter by movie ID if provided, otherwise filter by title
    if (movie_id) {
      where.id = movie_id;
    } else if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }

    if (language) {
      where.languages = { some: { language: { code: language } } };
    }

    if (genre) {
      where.genres = { some: { genre: { id: genre } } };
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
    date?: string,
    search?: string,
    city?: string
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
        // Parse เป็น local day แล้วคำนวณช่วงเวลาเป็น UTC เพื่อ match ค่าที่เก็บแบบ ISO UTC ใน DB
        // เช่น ถ้าเลือก 2025-11-12 ในโซนเวลา +07:00 → ช่วง UTC คือ 2025-11-11T17:00:00.000Z ถึง 2025-11-12T16:59:59.999Z
        let y: number, m: number, d: number;
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          const parts = date.split("-").map(Number);
          y = parts[0];
          m = parts[1];
          d = parts[2];
        } else {
          const tmp = new Date(date);
          if (isNaN(tmp.getTime())) throw new Error("Invalid date format");
          y = tmp.getFullYear();
          m = tmp.getMonth() + 1;
          d = tmp.getDate();
        }

        // Local start/end of day
        const localStart = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
        const localEnd = new Date(y, (m || 1) - 1, d || 1, 23, 59, 59, 999);
        const offsetMs = localStart.getTimezoneOffset() * 60 * 1000;
        const startUtc = new Date(localStart.getTime() - offsetMs);
        const endUtc = new Date(localEnd.getTime() - offsetMs);

        where.date = {
          gte: startUtc,
          lte: endUtc,
        };

        // (debug removed)
      } catch (error) {
        console.error("Invalid date parameter:", date, error);
        return [];
      }
    }

    const cinemaFilters: Prisma.CinemaWhereInput[] = [];

    if (search) {
      // Search in name field only
      cinemaFilters.push({
        OR: [
          {
            translations: {
              path: ["en", "name"],
              string_contains: search,
              mode: "insensitive",
            },
          },
          {
            translations: {
              path: ["th", "name"],
              string_contains: search,
              mode: "insensitive",
            },
          },
        ],
      });
    }
    if (cinemaFilters.length > 0) {
      where.cinema =
        cinemaFilters.length === 1 ? cinemaFilters[0] : { AND: cinemaFilters };
    }
    if (city) {
      const cityFilter: Prisma.CinemaWhereInput = {
        OR: [
          { city: { contains: city, mode: "insensitive" } },
          { city_en: { contains: city, mode: "insensitive" } },
        ],
      };
      where.cinema = where.cinema
        ? { AND: [where.cinema as Prisma.CinemaWhereInput, cityFilter] }
        : cityFilter;
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
            city_en: true,
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

      return updatedMovies.count;
    } catch (error) {
      console.error("Error updating movie status:", error);
      throw new Error("Failed to update movie status");
    }
  },
  async findMoviesForAdmin(): Promise<MovieDTO[]> {
    const movies = await prisma.movie.findMany({
      include: {
        genres: { include: { genre: true } },
        languages: { include: { language: true } },
        actors: { include: { actor: true } },
        directors: { include: { director: true } },
      },
    });

    return movies.map((m) => ({
      id: m.id,
      slug: m.slug,
      title: m.title,
      translations: m.translations,
      duration_min: m.duration_min,
      poster_url: m.poster_url,
      trailer_url: m.trailer_url,
      rating: m.rating,
      release_date: m.release_date,
      status: m.status,
      genres: m.genres.map((g) => ({ genre: g.genre })),
      languages: m.languages.map((l) => ({ language: l.language })),
      actors: m.actors.map((a) => ({ actor: a.actor })),
      directors: m.directors.map((d) => ({ director: d.director })),
    })) as MovieDTO[];
  },

  async createMovieForAdmin(
    movieData: Omit<MovieDTO, "id" | "slug"> & {
      slug: string;
      status: MovieStatus;
    }
  ): Promise<MovieDTO> {
    const createdMovie = await prisma.movie.create({
      data: {
        title: movieData.title,
        slug: movieData.slug,
        poster_url: movieData.poster_url,
        trailer_url: movieData.trailer_url,
        release_date: movieData.release_date,
        duration_min: movieData.duration_min,
        rating: movieData.rating,
        status: (movieData.status as MovieStatus) || MovieStatus.COMING_SOON,
        translations: movieData.translations as Prisma.JsonObject,
        genres: {
          create:
            (movieData.genres as { genre: { id: string } }[])?.map((g) => ({
              genre: { connect: { id: g.genre.id } },
            })) || [],
        },
        languages: {
          create:
            (movieData.languages as { language: { id: string } }[])?.map(
              (l) => ({
                language: { connect: { id: l.language.id } },
              })
            ) || [],
        },
        actors: {
          create:
            (movieData.actors as { actor: { id: string } }[])?.map((a) => ({
              actor: { connect: { id: a.actor.id } },
            })) || [],
        },
        directors: {
          create:
            (movieData.directors as { director: { id: string } }[])?.map(
              (d) => ({
                director: { connect: { id: d.director.id } },
              })
            ) || [],
        },
      },
      include: {
        genres: { include: { genre: true } },
        languages: { include: { language: true } },
        actors: { include: { actor: true } },
        directors: { include: { director: true } },
      },
    });

    return {
      id: createdMovie.id,
      slug: createdMovie.slug,
      title: createdMovie.title,
      translations:
        (createdMovie.translations as
          | {
              th?: { title: string; description: string };
              en?: { title: string; description: string };
            }
          | undefined) ?? undefined,
      duration_min: createdMovie.duration_min,
      poster_url: createdMovie.poster_url ?? undefined,
      trailer_url: createdMovie.trailer_url ?? undefined,
      rating: createdMovie.rating ?? undefined,
      release_date: createdMovie.release_date ?? undefined,
      status: createdMovie.status as string,
      genres: createdMovie.genres.map((g) => ({
        genre: {
          id: g.genre.id,
          name: g.genre.name,
          slug: g.genre.slug,
          translations:
            g.genre.translations && typeof g.genre.translations === "object"
              ? (g.genre.translations as {
                  en?: { name: string };
                  th?: { name: string };
                })
              : undefined,
        },
      })),
      languages: createdMovie.languages.map((l) => ({ language: l.language })),
      actors: createdMovie.actors.map((a) => ({ actor: a.actor })),
      directors: createdMovie.directors.map((d) => ({ director: d.director })),
    };
  },
  async updateMovieForAdmin(id: string, data: MovieDTO): Promise<MovieDTO> {
    try {
      await prisma.movieGenre.deleteMany({ where: { movie_id: id } });
      await prisma.movieLanguage.deleteMany({ where: { movie_id: id } });
      await prisma.movieActor.deleteMany({ where: { movie_id: id } });
      await prisma.movieDirector.deleteMany({ where: { movie_id: id } });

      const updateData: Prisma.MovieUpdateInput = {
        title: data.title,
        slug: data.slug,
        poster_url: data.poster_url,
        trailer_url: data.trailer_url,
        release_date: data.release_date,
        duration_min: data.duration_min,
        rating: data.rating,
        status: data.status as MovieStatus,
        translations: data.translations as Prisma.JsonObject,

        genres: {
          create:
            (data.genres as { genre: { id: string } }[])?.map((g) => ({
              genre: { connect: { id: g.genre.id } },
            })) ?? [],
        },
        languages: {
          create:
            data.languages?.map((l: { language: { id: string } }) => ({
              language: { connect: { id: l.language.id } },
            })) ?? [],
        },
        actors: {
          create:
            data.actors?.map((a: { actor: { id: string } }) => ({
              actor: { connect: { id: a.actor.id } },
            })) ?? [],
        },
        directors: {
          create:
            data.directors?.map((d: { director: { id: string } }) => ({
              director: { connect: { id: d.director.id } },
            })) ?? [],
        },
      };

      const updated = await prisma.movie.update({
        where: { id },
        data: updateData,
        include: {
          genres: { include: { genre: true } },
          languages: { include: { language: true } },
          actors: { include: { actor: true } },
          directors: { include: { director: true } },
        },
      });

      return updated as MovieDTO;
    } catch (error) {
      console.error("Error in moviesRepo.updateMovieForAdmin:", error);
      throw new Error("อัปเดตข้อมูลภาพยนตร์ไม่สำเร็จ");
    }
  },

  async deleteMovieForAdmin(id: string): Promise<boolean> {
    try {
      await prisma.movieGenre.deleteMany({
        where: { movie_id: id },
      });
      await prisma.movieLanguage.deleteMany({
        where: { movie_id: id },
      });
      await prisma.movieActor.deleteMany({
        where: { movie_id: id },
      });
      await prisma.movieDirector.deleteMany({
        where: { movie_id: id },
      });

      await prisma.movie.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error("Error deleting movie:", error);
      return false;
    }
  },
};
