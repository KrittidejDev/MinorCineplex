import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@/generated/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    showtime_id,
    user_id,
    seats,
    total_price,
    coupon_id,
    public_id,
    status,
  } = req.body;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!showtime_id || !user_id || !seats || !public_id || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      const booking = await prisma.booking.create({
        data: {
          public_id,
          showtime_id,
          user_id,
          total_price,
          coupon_id,
          status,
          seats: {
            create: seats.map(
              (seat: { showtime_seat_id: string; price: number }) => ({
                showtime_seat_id: seat.showtime_seat_id,
                price: seat.price,
              })
            ),
          },
        },
      });
      return res
        .status(200)
        .json({ bookingId: booking.id, public_id: booking.public_id });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (
          err.code === "P2002" &&
          err.meta &&
          Array.isArray(err.meta.target) &&
          err.meta.target.includes("public_id")
        ) {
          // public_id ซ้ำ, สร้างใหม่
          const randomStr = Math.random().toString(36).substr(2, 10);
          req.body.public_id = `booking-${randomStr}`;
          attempts++;
        } else {
          console.error("❌ Failed to create booking:", err);
          return res
            .status(500)
            .json({ error: "Failed to create booking", details: err.message });
        }
      } else {
        console.error("❌ Unexpected error during booking creation:", err);
        return res
          .status(500)
          .json({ error: "Unexpected error during booking creation" });
      }
    }
  }

  return res.status(500).json({
    error: "Unable to create unique public_id after multiple attempts",
  });
}
