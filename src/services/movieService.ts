import { prisma } from "@/lib/prisma";
import { APIMovie } from "@/types/movie";

export interface MovieFilters {
  id?: string;
  title?: string;
  genre?: string;
  language?: string;
  releaseDate?: string;
}

export const getMovies = async (
  filters?: MovieFilters
): Promise<APIMovie[]> => {
  const where: Record<string, unknown> = {};

  if (filters?.title) {
    where.title = { contains: filters.title, mode: "insensitive" };
  }

  if (filters?.genre) {
    where.genre = { equals: filters.genre, mode: "insensitive" };
  }

  if (filters?.language) {
    where.language = { equals: filters.language, mode: "insensitive" };
  }

  if (filters?.releaseDate) {
    const [day, month, year] = filters.releaseDate.split("/");

    if (day && month && year) {
      const formatted = `${year}-${month}-${day}`;
      const date = new Date(formatted);

      where.release_date = {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      };
    }
  }

  const movies = await prisma.movie.findMany({
    where,
    include: {
      actors: { include: { actor: true } },
      directors: { include: { director: true } },
      showtimes: { include: { time_slot: true } }, // <-- ดึง time_slot
    },
    orderBy: { release_date: "desc" },
  });

  return movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    duration_min: movie.duration_min,
    description: movie.description || null,
    poster_url: movie.poster_url || null,
    trailer_url: movie.trailer_url || null,
    genre: movie.genre || null,
    rating: movie.rating || null,
    release_date: movie.release_date || null,
    showtimes:
      movie.showtimes?.map((s) => {
        const dateStr = s.date.toISOString().split("T")[0];
        return new Date(`${dateStr}T${s.time_slot.start_time}`).toISOString();
      }) || [],
    actors:
      movie.actors?.map((ma) => ({
        id: ma.actor.id,
        name: ma.actor.name,
        imageUrl: ma.actor.image_url || undefined,
      })) || [],
    directors:
      movie.directors?.map((md) => ({
        id: md.director.id,
        name: md.director.name,
        imageUrl: md.director.image_url || undefined,
      })) || [],
    created_at: movie.created_at,
    updated_at: movie.updated_at,
  }));
};

export async function getMovieById(id: string): Promise<APIMovie | null> {
  const dbMovie = await prisma.movie.findUnique({
    where: { id },
    include: {
      actors: {
        include: { actor: true },
      },
      directors: {
        include: { director: true },
      },
    },
  });

  if (!dbMovie) return null;

  const movie: APIMovie = {
    id: dbMovie.id,
    title: dbMovie.title,
    duration_min: dbMovie.duration_min,
    description: dbMovie.description,
    poster_url: dbMovie.poster_url,
    trailer_url: dbMovie.trailer_url,
    genre: dbMovie.genre,
    rating: dbMovie.rating,
    created_at: dbMovie.created_at,
    updated_at: dbMovie.updated_at,
    release_date: dbMovie.release_date,
    actors:
      dbMovie.actors?.map((ma) => ({
        id: ma.actor.id,
        name: ma.actor.name,
        imageUrl: ma.actor.image_url || undefined,
      })) || [],
    directors:
      dbMovie.directors?.map((md) => ({
        id: md.director.id,
        name: md.director.name,
        imageUrl: md.director.image_url || undefined,
      })) || [],
  };

  return movie;
}

export async function createMovie(data: {
  title: string;
  description: string;
  duration: number;
  genre: string;
  rating: string;
  trailer?: string;
}) {
  return await prisma.movie.create({
    data: {
      title: data.title,
      description: data.description,
      duration_min: data.duration,
      genre: data.genre,
      rating: data.rating,
      trailer_url: data.trailer,
    },
  });
}

export async function updateMovie(id: string, data: Partial<APIMovie>) {
  const { actors, directors, ...rest } = data;

  return await prisma.movie.update({
    where: { id },
    data: {
      ...rest,
      actors: actors
        ? {
            set: actors.map((actor) => ({ id: actor.id })),
          }
        : undefined,
      directors: directors
        ? {
            set: directors.map((director) => ({ id: director.id })),
          }
        : undefined,
    },
  });
}

export async function deleteMovie(id: string) {
  return await prisma.movie.delete({
    where: { id },
  });
}
