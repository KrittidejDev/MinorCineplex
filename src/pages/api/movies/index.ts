import { getMovies } from "@/services/movieService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const movie = await getMovies();
    res.status(200).json({ movie });
  } catch (error: any) {
    console.error(error);
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Server Error" });
  }
}
