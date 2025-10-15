import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";
import { ably } from "@/lib/ablyServer";

type Data = { success: boolean; message?: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { seatId } = req.query;

  let userId = "guest";

  if (!seatId || Array.isArray(seatId)) {
    return res.status(400).json({ success: false, message: "Invalid seatId" });
  }

  if (req.body?.userId) {
    userId = req.body.userId;
  }

  try {
    if (req.method === "POST") {
      // LOCK
      const result = await sql`
        UPDATE showtime_seat
        SET status = 'LOCKED', locked_by = ${userId}, locked_at = NOW()
        WHERE id = ${seatId} AND status = 'AVAILABLE'
        RETURNING *;
      `;

      if (!result.length) {
        return res
          .status(400)
          .json({ success: false, message: "Seat not available" });
      }

      await ably.channels
        .get(`showtime:${result[0].showtime_id}`)
        .publish("update", {
          seatId,
          status: "LOCKED",
          locked_by: userId,
        });

      return res.json({ success: true });
    }

    if (req.method === "PATCH") {
      // UNLOCK
      const result = await sql`
        UPDATE showtime_seat
        SET status = 'AVAILABLE', locked_by = NULL, locked_at = NULL
        WHERE id = ${seatId}
        RETURNING *;
      `;

      if (!result.length) {
        return res
          .status(400)
          .json({ success: false, message: "Seat not found" });
      }

      await ably.channels
        .get(`showtime:${result[0].showtime_id}`)
        .publish("update", {
          seatId,
          status: "AVAILABLE",
        });

      return res.json({ success: true });
    }

    res.setHeader("Allow", ["POST", "PATCH"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
