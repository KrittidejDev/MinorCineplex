//api/filter/genre/index.ts
import { getFilterGenres } from "@/services/filterService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const genres = await getFilterGenres();
      return res.status(200).json(genres);
    }
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Server Error";
    return res.status(500).json({ error: message });
  }
}

