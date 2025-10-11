import { getCinemasByMovies, getCinemas,getCinemasForDropdown } from "@/services/cinemaService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { movie_id } = req.query;
    let cinema;
    if (req.query.type === "dropdown") {
      cinema = await getCinemasForDropdown();
    }
    // ถ้าไม่ส่ง movie_id หรือเป็นค่าว่าง ให้ query ทั้งหมด
    else if (!movie_id || movie_id === "" || typeof movie_id !== "string") {
      cinema = await getCinemas(); // เรียก function ใหม่ที่ query ทั้งหมด
    } else {
      // ถ้ามี movie_id ให้ filter ตาม movie_id
      cinema = await getCinemasByMovies(movie_id);
    }

    res.status(200).json({ cinema });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
  return res.status(500).json({ error: "Server Error" });
}
