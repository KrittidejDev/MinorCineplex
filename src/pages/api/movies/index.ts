import type { NextApiRequest, NextApiResponse } from "next";
import { moviesService } from "@/services/movieService";
import { MovieFilters, Pagination } from "@/types/movie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const filters: MovieFilters = {
        movie_id: req.query.movie_id as string | undefined,
        title: req.query.title as string | undefined,
        language: req.query.language as string | undefined,
        genre: req.query.genre as string | undefined,
        release_date: req.query.release_date as string | undefined,
        status: req.query.status as "NOW_SHOWING" | "COMING_SOON" | undefined,
      };

      const pagination: Pagination = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      };

      const { data, count } = await moviesService.getMovies(
        filters,
        pagination
      );

      res.status(200).json({ data, count });
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
