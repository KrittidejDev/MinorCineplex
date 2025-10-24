import type { NextApiRequest, NextApiResponse } from "next";
import { ably } from "@/lib/ablyServer";
import { SeatStatus, PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();

type Data = { success: boolean; message?: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { seatId } = req.query;

  if (!seatId || Array.isArray(seatId)) {
    return res.status(400).json({ success: false, message: "Invalid seatId" });
  }

  const userId = req.body?.userId || "guest";

  try {
    if (req.method === "POST") {
      const updated = await prisma.showtimeSeat.updateMany({
        where: {
          id: seatId as string,
          status: SeatStatus.AVAILABLE,
        },
        data: {
          status: SeatStatus.LOCKED,
          locked_by_user_id: userId,
          locked_until: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      if (updated.count === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Seat not available" });
      }

      const seatData = await prisma.showtimeSeat.findUnique({
        where: { id: seatId as string },
        select: { showtime_id: true },
      });

      if (seatData?.showtime_id) {
        await ably.channels
          .get(`showtime:${seatData.showtime_id}`)
          .publish("update", {
            seatId,
            status: SeatStatus.LOCKED,
            locked_by_user_id: userId,
          });
      }

      return res.json({ success: true });
    }

    if (req.method === "PATCH") {
      const seat = await prisma.showtimeSeat.update({
        where: { id: seatId as string },
        data: {
          status: SeatStatus.AVAILABLE,
          locked_by_user_id: null,
          locked_until: null,
        },
        select: { showtime_id: true },
      });

      await ably.channels
        .get(`showtime:${seat.showtime_id}`)
        .publish("update", {
          seatId,
          status: SeatStatus.AVAILABLE,
        });

      return res.json({ success: true });
    }

    res.setHeader("Allow", ["POST", "PATCH"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("❌ API Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
