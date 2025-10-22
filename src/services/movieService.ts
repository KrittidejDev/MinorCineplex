import { moviesRepo } from "@/repositories/moviesRepo";
import { MovieDTO, MovieFilters, Pagination, ShowtimeDTO } from "@/types/movie";

export const moviesService = {
  async getMovies(
    filters: MovieFilters,
    pagination?: Pagination
  ): Promise<{ data: MovieDTO[]; count: number }> {
    return moviesRepo.findMovies(filters, pagination);
  },

  async getMovie(id: string): Promise<MovieDTO | null> {
    return moviesRepo.findMovieById(id);
  },

  async getMovieBySlug(slug: string): Promise<MovieDTO | null> {
    const movie = await moviesRepo.findMovieBySlug(slug);
    if (!movie) {
      throw new Error(`ไม่พบภาพยนตร์ที่มี slug: ${slug}`);
    }
    return movie;
  },

  async getMovieShowtimes(slug: string, date?: string): Promise<ShowtimeDTO[]> {
    const showtimes = await moviesRepo.findMovieShowtimes(slug, date);
    return showtimes;
  },
  async getMoviesForAdmin(): Promise<MovieDTO[]> {
    return moviesRepo.findMoviesForAdmin();
  },
};
