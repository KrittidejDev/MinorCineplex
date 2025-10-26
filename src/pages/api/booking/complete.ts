import {  PrismaClient, ShowtimeSeat, UserCoupon } from "@/generated/prisma";
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
    !Array.isArray(seatIds) ||
    !seatIds.every((id: string) => typeof id === "string")
  ) {
    return res
      .status(400)
      .json({ error: "Invalid booking, user, or seat ID format" });
  }

  if (couponId && typeof couponId !== "string") {
    return res.status(400).json({ error: "Invalid coupon ID format" });
  }

  try {
    const now = new Date();

    // ดึงข้อมูล seat และ showtime
    const seats = await prisma.showtimeSeat.findMany({
      where: { id: { in: seatIds } },
      include: { showtime: true },
    });

    if (seats.length !== seatIds.length) {
      return res.status(404).json({ error: "Some seats not found" });
    }

    // ตรวจสอบ seat ที่ถูกล็อกโดย user และยังไม่หมดเวลา
    const invalidSeats = seats.filter(
      (seat) =>
        seat.status !== SeatStatus.LOCKED ||
        seat.locked_by_user_id !== userId ||
        (seat.locked_until && new Date(seat.locked_until) < now)
    );

    if (invalidSeats.length) {
      return res
        .status(403)
        .json({ error: "Some seats are not locked or have expired" });
    }

    // ตรวจสอบคูปอง
    let userCoupon: UserCoupon | null = null;
    if (couponId) {
      userCoupon = await prisma.userCoupon.findFirst({
        where: { coupon_id: couponId, user_id: userId, is_used: false },
      });
      if (!userCoupon) {
        return res
          .status(404)
          .json({ error: "Coupon not found or already used" });
      }
    }

    // Transaction update booking, seats และ coupon
    const updatedSeats = await prisma.$transaction(
      async (tx) => {
        await tx.booking.update({
          where: { id: bookingId },
          data: { status: "PAID" },
        });

        const updatedSeatList: ShowtimeSeat[] = [];
        for (const seat of seats) {
          const updatedSeat = await tx.showtimeSeat.update({
            where: { id: seat.id },
            data: {
              status: SeatStatus.BOOKED,
              // ไม่ลบ locked_by_user_id ของคนที่จองสำเร็จ
              locked_until: null,
            },
          });
          updatedSeatList.push(updatedSeat);
        }

        if (userCoupon) {
          await tx.userCoupon.update({
            where: { id: userCoupon.id },
            data: { is_used: true, used_at: now },
          });
        }

        return updatedSeatList;
      },
      { maxWait: 5000 } // timeout 5 วินาที
    );

    // Publish Ably update หลังจาก DB update เสร็จแล้ว
    const showtimeId = seats[0]?.showtime_id;
    if (showtimeId) {
      const channel = ably.channels.get(`showtime:${showtimeId}`);
      for (const seat of updatedSeats) {
        await channel.publish("update", {
          seatId: seat.id,
          status: SeatStatus.BOOKED,
          locked_by_user_id: seat.locked_by_user_id, // เก็บคนจองจริง
          locked_until: null,
        });
      }
    }

    return res
      .status(200)
      .json({ message: "Booking completed successfully", seats: updatedSeats });
  } catch (error) {
    console.error("Error completing booking:", error);
    return res.status(500).json({ error: "Failed to complete booking" });
  } finally {
    await prisma.$disconnect();
  }
}
