import type { NextApiRequest, NextApiResponse } from "next";
import { moviesService } from "@/services/movieService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const result = await moviesService.getMoviesForAdmin();
      return res.status(200).json(result);
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
