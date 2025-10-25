import type { NextApiRequest, NextApiResponse } from "next";
import { moviesService } from "@/services/movieService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid movie ID" });
  }
  try {
    if (req.method === "GET") {
      const movie = await moviesService.getMovie(id);
      if (!movie) {
        return res.status(404).json({ error: "ไม่พบภาพยนตร์ที่ระบุ" });
      }
      return res.status(200).json(movie);
    }
    if (req.method === "PUT") {
      const data = req.body;
      if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "ข้อมูลไม่ถูกต้อง" });
      }

      const updatedMovie = await moviesService.updateMovieForAdmin(id, data);
      if (!updatedMovie) {
        return res.status(400).json({ error: "อัปเดตข้อมูลภาพยนตร์ไม่สำเร็จ" });
      }

      return res.status(200).json({
        success: true,
        message: "อัปเดตข้อมูลภาพยนตร์สำเร็จ",
        movie: updatedMovie,
      });
    }
    if (req.method === "DELETE") {
      const deleted = await moviesService.deleteMovieForAdmin(id);
      if (!deleted) {
        return res.status(400).json({ error: "ลบภาพยนตร์ไม่สำเร็จ" });
      }
      return res
        .status(200)
        .json({ success: true, message: "ลบภาพยนตร์สำเร็จ" });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error handling movie by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
