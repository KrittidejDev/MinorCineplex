import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "@/lib/prisma";

const TMDB_API_KEY = process.env.TMDB_API_KEY!;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { tmdbId } = req.body;

  if (!tmdbId) {
    return res.status(400).json({ error: "TMDb ID is required" });
  }

  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=th-TH&append_to_response=videos`
    );
    const movie = response.data;

    const movieData = {
      title: movie.title,
      description: movie.overview || null,
      posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      genre: movie.genres.map((g: any) => g.name).join(", ") || null,
      rating: movie.vote_average ? movie.vote_average.toString() : null,
      durationMin: movie.runtime || 120,
    };

    const existingMovie = await prisma.movie.findUnique({
      where: { title: movieData.title },
    });

    if (existingMovie) {
      return res.status(400).json({ error: "Movie already exists" });
    }

    const createdMovie = await prisma.movie.create({
      data: movieData,
    });

    const trailer = movie.videos.results.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube"
    );
    if (trailer) {
      await prisma.trailer.create({
        data: {
          movieId: createdMovie.id,
          url: `https://www.youtube.com/watch?v=${trailer.key}`,
        },
      });
    }

    res
      .status(200)
      .json({ message: "Movie added successfully", movie: createdMovie });
  } catch (error) {
    console.error("Error adding movie:", error);
    res.status(500).json({ error: "Failed to add movie" });
  }
}
