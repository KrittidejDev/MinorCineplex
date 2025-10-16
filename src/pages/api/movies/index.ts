import { getMovies, createMovie, MovieFilters } from "@/services/movieService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const {
        id,
        title,
        genre,
        language,
        releaseDate,
        page = "1",
        limit = "20",
      } = req.query;

      const filters: MovieFilters = {};
      if (id) filters.id = Array.isArray(id) ? id[0] : id;
      if (title) filters.title = Array.isArray(title) ? title[0] : title;
      if (genre) filters.genre = Array.isArray(genre) ? genre[0] : genre;
      if (language)
        filters.language = Array.isArray(language) ? language[0] : language;
      if (releaseDate)
        filters.releaseDate = Array.isArray(releaseDate)
          ? releaseDate[0]
          : releaseDate;

      const skip =
        (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
      const take = parseInt(limit as string, 10);

      const movies = await getMovies(filters, { skip, take });

      return res.status(200).json({ movie: movies });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error)
        return res.status(500).json({ error: error.message });
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, description, duration, genre, rating, trailer } = req.body;

      if (!title || !description || !duration || !genre || !rating) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newMovie = await createMovie({
        title,
        description,
        duration: Number(duration),
        genre,
        rating,
        trailer,
      });

      return res
        .status(201)
        .json({ message: "Movie created", movie: newMovie });
    } catch (error: unknown) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create movie" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
