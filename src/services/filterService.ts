import { findGenres } from "@/repositories/filterRepository";

type GenreTranslations = {
  en?: { name: string };
  th?: { name: string };
};

export const getFilterGenres = async () => {
  const genres = await findGenres();
  const genreOptions = genres.map((genre) => {
    const translations = genre.translations as GenreTranslations | null;
    return {
      id: genre.id,
      name_en: translations?.en?.name || genre.name,
      name_th: translations?.th?.name || genre.name,
    };
  });
  return genreOptions;
};

