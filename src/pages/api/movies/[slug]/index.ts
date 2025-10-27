import type { NextApiRequest, NextApiResponse } from "next";
import { moviesService } from "@/services/movieService";
import { MovieDTO } from "@/types/movie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const slug = req.query.slug as string;
      if (!slug) {
        return res.status(400).json({ message: "Slug is required" });
      }

      const movie = await moviesService.getMovieBySlug(slug);
      if (!movie) {
        return res
          .status(404)
          .json({ message: `ไม่พบภาพยนตร์ที่มี slug: ${slug}` });
      }

      res.status(200).json(movie);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error fetching movie by slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
