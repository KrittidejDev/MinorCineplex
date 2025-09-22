import { getMovies } from "@/services/movieService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const movie = await getMovies();
    res.status(200).json({ movie });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
  return res.status(500).json({ error: "Server Error" });
}
