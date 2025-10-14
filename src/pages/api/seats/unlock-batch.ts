import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";
import { ably } from "@/lib/ablyServer";

type Data = { success: boolean; message?: string; unlockedCount?: number };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { seats } = req.body;

  if (!seats || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid seats array",
    });
  }

  try {
    if (seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No seats provided",
      });
    }
    const results = await Promise.all(
      seats.map(
        (seatId: string) =>
          sql`
          UPDATE showtime_seat
          SET status = 'AVAILABLE', locked_by = NULL, locked_at = NULL
          WHERE id = ${seatId}
          RETURNING id, showtime_id;
        `
      )
    );
    const result = results.flat().filter((r) => r.id);
    if (!result.length) {
      return res.status(400).json({
        success: false,
        message: "No seats found",
      });
    }

    const showtimeGroups = result.reduce(
      (acc, seat) => {
        if (!acc[seat.showtime_id]) {
          acc[seat.showtime_id] = [];
        }
        acc[seat.showtime_id].push(seat.id);
        return acc;
      },
      {} as Record<string, string[]>
    );

    const broadcastPromises = Object.entries(showtimeGroups).map(
      ([showtimeId, seatIds]) =>
        Promise.all(
          seatIds.map((seatId: string) =>
            ably.channels.get(`showtime:${showtimeId}`).publish("update", {
              seatId,
              status: "AVAILABLE",
              lockedBy: null,
              locked_at: null,
              lockExpire: null,
            })
          )
        )
    );

    await Promise.all(broadcastPromises);
    console.log("✅ Ably broadcast completed for", result.length, "seats");

    return res.json({ success: true, unlockedCount: result.length });
  } catch (err) {
    console.error("Unlock batch error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
