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
  const where: {
    id?: string;
    title?: { contains: string; mode: "insensitive" };
    genre?: { equals: string; mode: "insensitive" };
    language?: { equals: string; mode: "insensitive" };
    release_date?: { gte: Date; lte: Date };
  } = {};

  if (filters?.id) where.id = filters.id;
  if (filters?.title)
    where.title = { contains: filters.title, mode: "insensitive" };
  if (filters?.genre)
    where.genre = { equals: filters.genre, mode: "insensitive" };
  if (filters?.language)
    where.language = { equals: filters.language, mode: "insensitive" };
  if (filters?.releaseDate) {
    const [day, month, year] = filters.releaseDate.split("/");
    if (day && month && year) {
      const date = new Date(`${year}-${month}-${day}`);
      where.release_date = {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      };
    }
  }

  const movies = await prisma.movie.findMany({
    where,
    select: {
      id: true,
      title: true,
      duration_min: true,
      description: true,
      poster_url: true,
      trailer_url: true,
      genre: true,
      rating: true,
      release_date: true,
      created_at: true,
      updated_at: true,
      showtimes: {
        select: {
          date: true,
          time_slot: { select: { start_time: true } },
        },
      },
      actors: {
        select: {
          actor: { select: { id: true, name: true, image_url: true } },
        },
      },
      directors: {
        select: {
          director: { select: { id: true, name: true, image_url: true } },
        },
      },
    },
    orderBy: { release_date: "desc" },
  });

  return movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    duration_min: movie.duration_min,
    description: movie.description ?? null,
    poster_url: movie.poster_url ?? null,
    trailer_url: movie.trailer_url ?? null,
    genre: movie.genre ?? null,
    rating: movie.rating ?? null,
    release_date: movie.release_date ?? null,
    showtimes:
      movie.showtimes?.map((s) => {
        const dateStr = s.date.toISOString().split("T")[0];
        return new Date(`${dateStr}T${s.time_slot.start_time}`).toISOString();
      }) ?? [],
    actors:
      movie.actors?.map((ma) => ({
        id: ma.actor.id,
        name: ma.actor.name,
        imageUrl: ma.actor.image_url ?? undefined,
      })) ?? [],
    directors:
      movie.directors?.map((md) => ({
        id: md.director.id,
        name: md.director.name,
        imageUrl: md.director.image_url ?? undefined,
      })) ?? [],
    created_at: movie.created_at,
    updated_at: movie.updated_at,
  }));
};

export async function createMovie(data: {
  title: string;
  description: string;
  duration: number;
  genre: string;
  rating: string;
  trailer?: string;
}) {
  return prisma.movie.create({
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
