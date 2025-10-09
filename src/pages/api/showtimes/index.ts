import { getShowTimes } from "@/services/showTimeService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { limit, movie, cinema, hall } = req.query;
  const limitNumber = typeof limit === "string" ? parseInt(limit) : 10;
  const movieString = typeof movie === "string" ? movie : undefined;
  const cinemaString = typeof cinema === "string" ? cinema : undefined;
  const hallString = typeof hall === "string" ? hall : undefined;
  try {
    const showTimes = await getShowTimes({
      limit: limitNumber,
      movie: movieString,
      cinema: cinemaString,
      hall: hallString,
    });
    res.status(200).json({ showTimes });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
  return res.status(500).json({ error: "Server Error" });
}
