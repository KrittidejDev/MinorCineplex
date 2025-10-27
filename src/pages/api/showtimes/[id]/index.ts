import {
  getShowTimeById,
  deleteShowTimeById,
  updateShowTimeById,
} from "@/services/showTimeService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const showTimes = await getShowTimeById(id);
      res.status(200).json({ showTimes });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const showTimes = await deleteShowTimeById(id);
      res.status(200).json({ showTimes });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { movie_id, hall_id, cinema_id, time_slot_id, date, price } = req.body;
      if (!movie_id || !hall_id || !cinema_id || !time_slot_id || !date || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await updateShowTimeById(id, {
        movie_id,
        hall_id,
        cinema_id,
        time_slot_id,
        date,
        price,
      });
      res.status(200).json({ message: "Show time updated successfully" });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
  return res.status(500).json({ error: "Server Error" });
}
