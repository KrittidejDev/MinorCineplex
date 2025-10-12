import { getShowTimes, createShowTime } from "@/services/showTimeService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { limit, movie, cinema, hall, timeSlot, date } = req.query;
    const limitNumber = typeof limit === "string" ? parseInt(limit) : 10;
    const movieString = typeof movie === "string" ? movie : undefined;
    const hallString = typeof hall === "string" ? hall : undefined;
    const timeSlotString = typeof timeSlot === "string" ? timeSlot : undefined;
    const dateString = typeof date === "string" ? date : undefined;
    try {
      const showTimes = await getShowTimes({
        limit: limitNumber,
        movie: movieString,
        hall: hallString,
        timeSlot: timeSlotString,
        date: dateString, 
      });
      const totalPages = showTimes.length / limitNumber;
      res.status(200).json({ showTimes, totalPages });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
  if (req.method === "POST") {
    const { movie, hall, timeSlot, date, price } = req.body;
    if (!movie || !hall || !timeSlot || !date || !price) {
      return res.status(400).json({ 
        error: "Missing required fields" 
      });
    }
    try {
      const showTime = await createShowTime({
        movie,
        hall,
        timeSlot,
        date,
        price,
      });
      res.status(200).json({ showTime });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
