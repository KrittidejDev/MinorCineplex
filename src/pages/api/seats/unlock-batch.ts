import type { NextApiRequest, NextApiResponse } from "next";
import { ably } from "@/lib/ablyServer";
import { SeatStatus } from "@/generated/prisma";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

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
    // ---------------- UNLOCK SEATS ----------------
    const results = await Promise.all(
      seats.map(async (seatId: string) => {
        try {
          return await prisma.showtimeSeat.update({
            where: { id: seatId },
            data: {
              status: SeatStatus.AVAILABLE,
              locked_by_user_id: null,
              locked_until: null,
            },
            select: { id: true, showtime_id: true },
          });
        } catch (err) {
          console.warn(`Seat ${seatId} cannot be unlocked:`, err);
          return null;
        }
      })
    );

    const unlockedSeats = results.filter((r) => r !== null) as {
      id: string;
      showtime_id: string;
    }[];

    if (!unlockedSeats.length) {
      return res.status(400).json({
        success: false,
        message: "No seats were unlocked",
      });
    }

    // ---------------- BROADCAST ABLY ----------------
    const showtimeGroups = unlockedSeats.reduce(
      (acc, seat) => {
        if (!acc[seat.showtime_id]) acc[seat.showtime_id] = [];
        acc[seat.showtime_id].push(seat.id);
        return acc;
      },
      {} as Record<string, string[]>
    );

    // publish แบบ type-safe server-side (ไม่มี callback)
    Object.entries(showtimeGroups).forEach(([showtimeId, seatIds]) => {
      const channel = ably.channels.get(`showtime:${showtimeId}`);
      seatIds.forEach((seatId) => {
        channel.publish("update", {
          seatId,
          status: SeatStatus.AVAILABLE,
          locked_by_user_id: null,
          locked_until: null,
        });
      });
    });

    return res.json({ success: true, unlockedCount: unlockedSeats.length });
  } catch (err) {
    console.error("Unlock batch error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
