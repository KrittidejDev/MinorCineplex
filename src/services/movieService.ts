import * as movieRepo from "../repositories/movieRepository";
import { prisma } from "@/lib/prisma";

interface APIMovie {
    id: string;
    title: string;
    duration_min: number;
    description?: string | null;
    poster_url?: string | null;
    trailer_url?: string | null;
    genre?: string | null;
    rating?: string | null;
    created_at: Date;
    updated_at: Date;
    release_date?: Date | null;
  }

export const getMovies = async () => {
  const movies = await movieRepo.getMany();
  return movies;
};

export async function getMovieById(id: string): Promise<APIMovie | null> {
  return prisma.movie.findUnique({
    where: { id }, // id เป็น string ตรงกับ UUID
  });
}
