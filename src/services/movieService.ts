import * as movieRepo from "../repositories/movieRepository";
import { prisma } from "@/lib/prisma";
import { APIMovie, Actor, Director } from "@/types/movie";

export const getMovies = async () => {
  const movies = await movieRepo.getMany();
  return movies;
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
    actors: dbMovie.actors?.map((ma) => ({
      id: ma.actor.id,
      name: ma.actor.name,
      imageUrl: ma.actor.image_url || undefined,
    })) || [],
    directors: dbMovie.directors?.map((md) => ({
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