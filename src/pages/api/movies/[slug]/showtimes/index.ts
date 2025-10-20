import type { NextApiRequest, NextApiResponse } from "next";
import { moviesService } from "@/services/movieService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const slug = req.query.slug as string;
      const date = req.query.date as string | undefined;

      if (!slug) {
        return res.status(400).json({ message: "Slug is required" });
      }

      const showtimes = await moviesService.getMovieShowtimes(slug, date);
      res.status(200).json(showtimes);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error fetching movie showtimes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
