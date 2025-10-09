import { getBookingInfo } from "@/services/showTimeService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing showtime ID" });
  }

  try {
    const bookingData = await getBookingInfo(id);
    if (!bookingData)
      return res.status(404).json({ error: "Showtime not found" });

    res.status(200).json(bookingData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch booking info" });
  }
}
