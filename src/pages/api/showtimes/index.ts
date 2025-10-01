import { getShowTimes } from "@/services/showTimeService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { movie_id } = req.query;
    if (typeof movie_id !== "string") {
      return res
        .status(400)
        .json({ error: "movie_id is required and must be a string" });
    }
    const showTimes = await getShowTimes(movie_id);
    res.status(200).json({ showTimes });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
  return res.status(500).json({ error: "Server Error" });
}
