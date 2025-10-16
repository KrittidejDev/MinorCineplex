import { getMovieById, updateMovie, deleteMovie } from "@/services/movieService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid movie ID" });
  }

  try {
    switch (req.method) {
      case "GET":
        const movie = await getMovieById(id);
        if (!movie) return res.status(404).json({ error: "Movie not found" });
        return res.status(200).json({ movie });

      case "PUT":
        const data = req.body;
        if (!data) return res.status(400).json({ error: "Missing update data" });

        const updatedMovie = await updateMovie(id, data);
        return res.status(200).json({ movie: updatedMovie });

      case "DELETE":
        await deleteMovie(id);
        return res.status(200).json({ message: "Movie deleted successfully" });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) return res.status(500).json({ error: error.message });
    return res.status(500).json({ error: "Server Error" });
  }
}
