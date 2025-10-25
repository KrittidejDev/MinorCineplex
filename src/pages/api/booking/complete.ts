import { Prisma, PrismaClient } from "@/generated/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import Ably from "ably";
import { SeatStatus } from "@/generated/prisma";

const prisma = new PrismaClient();
const ably = new Ably.Realtime({ key: process.env.ABLY_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { bookingId, seatIds, userId, couponId } = req.body;

  if (
    !bookingId ||
    typeof bookingId !== "string" ||
    !userId ||
    typeof userId !== "string" ||
    !seatIds.every((id: string) => typeof id === "string")
  ) {
    console.error("Invalid input:", { bookingId, userId, seatIds });
    return res
      .status(400)
      .json({ error: "Invalid booking, user, or seat ID format" });
  }

  if (couponId && typeof couponId !== "string") {
    console.error("Invalid couponId:", couponId);
    return res.status(400).json({ error: "Invalid coupon ID format" });
  }

  try {
    const seats = await prisma.showtimeSeat.findMany({
      where: { id: { in: seatIds } },
      include: { showtime: true }, // Include showtime to get showtime_id
    });

    const now = new Date();
    const invalidSeats = seats.filter(
      (seat) =>
        seat.status !== "LOCKED" as SeatStatus ||
        seat.locked_by_user_id !== userId ||
        (seat.locked_until && new Date(seat.locked_until) < now)
    );

    if (invalidSeats.length) {
      console.error(
        "Invalid seats:",
        invalidSeats.map((s) => s.id)
      );
      return res
        .status(403)
        .json({ error: "Some seats are not locked or have expired" });
    }

    const transactionOperations: Prisma.PrismaPromise<unknown>[] = [
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: "PAID" },
      }),
      prisma.showtimeSeat.updateMany({
        where: { id: { in: seatIds } },
        data: { status: "BOOKED", locked_by_user_id: null, locked_until: null },
      }),
    ];

    if (couponId) {
      const userCoupon = await prisma.userCoupon.findFirst({
        where: { coupon_id: couponId, user_id: userId, is_used: false },
      });

      if (!userCoupon) {
        console.error("UserCoupon not found or already used:", {
          couponId,
          userId,
        });
        return res
          .status(404)
          .json({ error: "Coupon not found or already used" });
      }

      transactionOperations.push(
        prisma.userCoupon.update({
          where: { id: userCoupon.id },
          data: { is_used: true, used_at: new Date() },
        })
      );
    }

    await prisma.$transaction(transactionOperations);

    const showtimeId = seats[0]?.showtime_id;
    if (showtimeId) {
      const channel = ably.channels.get(`showtime:${showtimeId}`);
      for (const seatId of seatIds) {
        await channel.publish("update", {
          seatId,
          status: "BOOKED",
          locked_by_user_id: null,
          locked_until: null,
        });
        console.log(
          `Published Ably update for seat ${seatId} to showtime:${showtimeId}`
        );
      }
    } else {
      console.error("No showtimeId found for seats:", seatIds);
    }

    console.log(
      `Booking ${bookingId} completed with seats ${seatIds.join(", ")}`
    );
    res.status(200).json({ message: "Booking completed successfully" });
  } catch (error) {
    console.error("Error completing booking:", error);
    res.status(500).json({ error: "Failed to complete booking" });
  } finally {
    await prisma.$disconnect();
  }
}
