// pages/api/booking/showtimes/[id]/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { bookingService } from "@/services/bookingServices";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!id || typeof id !== "string")
    return res.status(400).json({ error: "Invalid showtime ID" });

  try {
    const data = await bookingService.getShowtimeDetail(id);

    // Cache client 10 วินาที
    res.setHeader(
      "Cache-Control",
      "public, max-age=10, stale-while-revalidate=59"
    );
    return res.status(200).json(data);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Unknown error occurred" });
  }
}
