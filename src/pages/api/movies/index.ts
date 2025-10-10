import { getMovies, createMovie } from "@/services/movieService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const movie = await getMovies();
      res.status(200).json({ movie });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
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
