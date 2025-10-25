import {
  getShowTimesForAdmin,
  createShowTime,
} from "@/services/showTimeService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { limit, movie, hall, timeSlot, date, page, cinema } = req.query;
    const limitNumber = typeof limit === "string" ? parseInt(limit) : 10;
    const movieString = typeof movie === "string" ? movie : undefined;
    const cinemaString = typeof cinema === "string" ? cinema : undefined;
    const hallString = typeof hall === "string" ? hall : undefined;
    const timeSlotString = typeof timeSlot === "string" ? timeSlot : undefined;
    const dateString = typeof date === "string" ? date : undefined;
    const pageNumber = typeof page === "string" ? parseInt(page) : 1;
    try {
      const { showTimes, total } = await getShowTimesForAdmin({
        limit: limitNumber,
        cinema: cinemaString,
        movie: movieString,
        hall: hallString,
        timeSlot: timeSlotString,
        date: dateString,
        page: pageNumber,
      });

      const totalPages = Math.ceil(total / limitNumber);

      res
        .status(200)
        .json({ showTimes, total, totalPages, currentPage: pageNumber });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
  if (req.method === "POST") {
    const { movie_id, hall_id, cinema_id, time_slot_id, date, price } = req.body;
    if (!movie_id || !hall_id || !cinema_id || !time_slot_id || !date || !price) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }
    try {
      const showTime = await createShowTime({
        movie_id,
        hall_id,
        cinema_id,
        time_slot_id,
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
