import * as movieRepo from "../repositories/movieRepository";
import { prisma } from "@/lib/prisma";
import { APIMovie } from "@/types/movie";

export const getMovies = async () => {
  const movies = await movieRepo.getMany();
  return movies;
};

export async function getMovieById(id: string): Promise<APIMovie | null> {
  return prisma.movie.findUnique({
    where: { id }, // id เป็น string ตรงกับ UUID
  });
}
