import { moviesRepo } from "@/repositories/moviesRepo";
import { MovieDTO, MovieFilters, Pagination, ShowtimeDTO } from "@/types/movie";
import { MovieStatus } from "@/generated/prisma";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");
}

function parseMovieStatus(status?: string): MovieStatus {
  if (status === MovieStatus.NOW_SHOWING) return MovieStatus.NOW_SHOWING;
  if (status === MovieStatus.ENDED) return MovieStatus.ENDED;
  return MovieStatus.COMING_SOON;
}

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

  async getMovieShowtimes(slug: string, date?: string, search?: string, city?: string): Promise<ShowtimeDTO[]> {
    const showtimes = await moviesRepo.findMovieShowtimes(slug, date, search, city);
    return showtimes;
  },
  async getMoviesForAdmin(): Promise<MovieDTO[]> {
    return moviesRepo.findMoviesForAdmin();
  },
  async createMovieForAdmin(movieData: Omit<MovieDTO, "id">): Promise<MovieDTO> {
    try {
      const slug = generateSlug(movieData.title);
      
      const genres = movieData.genres
        .map((g) => ("genre" in g ? {
          genre: {
            id: g.genre.id,
            name: g.genre.name,
            slug: g.genre.slug,
            translations: g.genre.translations,
          },
        } : undefined))
        .filter(Boolean) as typeof movieData.genres;

      const languages = movieData.languages
        .map((l) => ("language" in l ? {
          language: {
            id: l.language.id,
            name: l.language.name,
            code: l.language.code,
          },
        } : undefined))
        .filter(Boolean) as typeof movieData.languages;

      const actors = (movieData.actors || []).map(a => ({
        actor: { id: a.actor.id, name: a.actor.name },
      }));

      const directors = (movieData.directors || []).map(d => ({
        director: { id: d.director.id, name: d.director.name },
      }));

      const payload: Omit<MovieDTO, "id"> & { slug: string; status: MovieStatus } = {
        ...movieData,
        slug,
        status: parseMovieStatus(movieData.status),
        genres,
        languages,
        actors,
        directors,
      };

      const createdMovie = await moviesRepo.createMovieForAdmin(payload);
      return createdMovie;

    } catch (error) {
      console.error("Error creating movie:", error);
      throw new Error("ไม่สามารถสร้างภาพยนตร์ได้");
    }
  },
  async updateMovieForAdmin(id: string, movieData: Partial<MovieDTO>): Promise<MovieDTO> {
  try {
    const slug = movieData.title ? generateSlug(movieData.title) : undefined;

    const genres = movieData.genres
      ?.map((g) =>
        "genre" in g
          ? {
              genre: {
                id: g.genre.id,
                name: g.genre.name,
                slug: g.genre.slug,
                translations: g.genre.translations,
              },
            }
          : undefined
      )
      .filter(Boolean) as typeof movieData.genres;

    const languages = movieData.languages
      ?.map((l) =>
        "language" in l
          ? {
              language: {
                id: l.language.id,
                name: l.language.name,
                code: l.language.code,
              },
            }
          : undefined
      )
      .filter(Boolean) as typeof movieData.languages;

    const actors = movieData.actors
      ? movieData.actors.map((a) => ({
          actor: { id: a.actor.id, name: a.actor.name },
        }))
      : undefined;

    const directors = movieData.directors
      ? movieData.directors.map((d) => ({
          director: { id: d.director.id, name: d.director.name },
        }))
      : undefined;

    const payload: any = {
      ...movieData,
      ...(slug && { slug }),
      ...(movieData.status && { status: parseMovieStatus(movieData.status) }),
      ...(genres && { genres }),
      ...(languages && { languages }),
      ...(actors && { actors }),
      ...(directors && { directors }),
    };

    const updatedMovie = await moviesRepo.updateMovieForAdmin(id, payload);
    return updatedMovie;
  } catch (error) {
    console.error("Error updating movie:", error);
    throw new Error("ไม่สามารถอัปเดตข้อมูลภาพยนตร์ได้");
  }
},
  async deleteMovieForAdmin(id: string): Promise<boolean> {
    try {
      const result = await moviesRepo.deleteMovieForAdmin(id);
      if (!result) {
        throw new Error("ลบภาพยนตร์ไม่สำเร็จ");
      }
      return true;
    } catch (error) {
      console.error("Error deleting movie:", error);
      throw new Error("ไม่สามารถลบภาพยนตร์ได้");
    }
  },
};
