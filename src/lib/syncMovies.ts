import axios from "axios";
import { prisma } from "./prisma";

const TMDB_API_KEY = process.env.TMDB_API_KEY!;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function syncPopularMovies() {
  try {
    // ดึงภาพยนตร์ยอดนิยม (20 เรื่องแรก)
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=th-TH&page=1`
    );
    const movies = response.data.results;

    for (const movie of movies) {
      const movieData = {
        title: movie.title,
        description: movie.overview || null,
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        genre:
          movie.genre_ids.map((id: number) => id.toString()).join(", ") || null,
        rating: movie.vote_average ? movie.vote_average.toString() : null,
        durationMin: 120,
      };

      // ตรวจสอบว่าภาพยนตร์มีอยู่แล้วหรือไม่
      const existingMovie = await prisma.movie.findUnique({
        where: { title: movieData.title },
      });

      if (!existingMovie) {
        const createdMovie = await prisma.movie.create({
          data: movieData,
        });

        // ดึง trailer
        const videoResponse = await axios.get(
          `${TMDB_BASE_URL}/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=th-TH`
        );
        const trailer = videoResponse.data.results.find(
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
      }
    }
    console.log("Movies synced successfully!");
  } catch (error) {
    console.error("Error syncing movies:", error);
    throw error;
  }
}
