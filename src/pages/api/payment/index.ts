import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // import prisma client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, seats, couponId } = req.body as {
    userId: string;
    seats: string[];
    couponId?: string;
  };

  if (!seats || seats.length === 0) {
    return res.status(400).json({ message: "No seats selected" });
  }

  try {
    // 1. Lock seats check
    const seatRecords = await prisma.showtime_seat.findMany({
      where: { id: { in: seats } },
    });

    for (const seat of seatRecords) {
      if (seat.status !== "AVAILABLE") {
        return res
          .status(400)
          .json({ message: `Seat ${seat.id} is not available` });
      }
    }

    // 2. Calculate total price
    const totalPrice = seatRecords.reduce(
      (sum, seat) => sum + (seat.price ?? 0),
      0
    );

    // 3. Apply coupon if available
    let discount = 0;
    if (couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: couponId },
      });
      if (coupon) {
        if (coupon.discount_type === "PERCENT") {
          discount = (totalPrice * coupon.discount_value) / 100;
        } else {
          discount = coupon.discount_value;
        }
      }
    }

    const finalPrice = totalPrice - discount;

    // 4. Create booking
    const booking = await prisma.booking.create({
      data: {
        user_id: userId,
        showtime_id: seatRecords[0].showtime_id,
        status: "PAID",
        total_price: finalPrice,
        seats: {
          create: seats.map((seatId) => ({
            seat_id: seatId,
            price: seatRecords.find((s) => s.id === seatId)?.price ?? 0,
          })),
        },
      },
      include: { seats: true },
    });

    // 5. Update seat status
    await prisma.showtime_seat.updateMany({
      where: { id: { in: seats } },
      data: { status: "PAID", locked_by: null, locked_at: null },
    });

    return res.status(200).json({ success: true, booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Payment failed", error: err });
  }
}
