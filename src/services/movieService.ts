import * as movieRepo from "../repositories/movieRepository";

export const getMovies = async () => {
  const movies = await movieRepo.getMany();
  return movies;
};

export const getMovieById = async (id) => {
  const movies = await movieRepo.getById(id);
  return movies;
};
