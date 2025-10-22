import { findGenres } from "@/repositories/filterRepository";

export const getFilterGenres = async () => {
  const genres = await findGenres();
  const genreOptions = genres.map((genre) => ({
    id: genre.id,
    name: genre.name,
  }));
  return genreOptions;
};

