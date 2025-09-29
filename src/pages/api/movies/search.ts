import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY!;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q: query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=th-TH&query=${encodeURIComponent(query)}`
    );
    const movies = response.data.results.map((movie: any) => ({
      tmdbId: movie.id,
      title: movie.title,
      description: movie.overview || null,
      posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      genre:
        movie.genre_ids.map((id: number) => id.toString()).join(", ") || null,
      rating: movie.vote_average ? movie.vote_average.toString() : null,
    }));

    res.status(200).json(movies);
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500).json({ error: "Failed to search movies" });
  }
}
