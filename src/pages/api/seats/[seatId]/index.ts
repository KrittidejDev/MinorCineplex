// pages/api/seats/[seatId].ts
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
    const now = new Date();

    // POST: ล็อกที่นั่ง
    if (req.method === "POST") {
      // อัปเดตเฉพาะที่นั่งว่าง หรือที่นั่ง LOCKED แต่หมดเวลาแล้ว
      const updatedSeat = await prisma.showtimeSeat.updateMany({
        where: {
          id: seatId as string,
          OR: [
            { status: SeatStatus.AVAILABLE },
            { status: SeatStatus.LOCKED, locked_until: { lt: now } },
          ],
        },
        data: {
          status: SeatStatus.LOCKED,
          locked_by_user_id: userId,
          locked_until: new Date(now.getTime() + 5 * 60 * 1000), // 5 นาที
        },
      });

      if (updatedSeat.count === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Seat not available" });
      }

      // Fetch showtime_id เพื่อ publish ผ่าน Ably
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
            locked_until: new Date(now.getTime() + 5 * 60 * 1000).getTime(),
          });
      }

      return res.json({ success: true });
    }

    // PATCH: ปลดล็อกที่นั่ง
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

      // publish ผ่าน Ably
      await ably.channels
        .get(`showtime:${seat.showtime_id}`)
        .publish("update", {
          seatId,
          status: SeatStatus.AVAILABLE,
          locked_by_user_id: null,
          locked_until: null,
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
