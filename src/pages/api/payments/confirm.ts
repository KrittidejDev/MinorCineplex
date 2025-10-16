// pages/api/payments/confirm.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { sql } from "@/lib/db";
import { ably } from "@/lib/ablyServer";

interface ShowtimeSeat {
  id: string;
  showtime_id: string;
  seat_id: string;
  status: "AVAILABLE" | "LOCKED" | "BOOKED";
  price: number;
  locked_at: string | null;
  locked_by: string | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { showtimeId, seats, totalPrice, couponId } = req.body as {
    showtimeId: string;
    seats: string[];
    totalPrice: number;
    couponId?: string | null;
  };

  if (!showtimeId || !seats || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    // ดึงข้อมูลเก้าอี้จาก DB
    const seatRecordsRaw: Record<string, unknown>[] = await sql`
      SELECT id, showtime_id, seat_id, status, price, locked_at, locked_by
      FROM showtime_seat
      WHERE showtime_id = ${showtimeId}
      AND id = ANY(${seats})
    `;

    // แปลงเป็น ShowtimeSeat[]
    const seatRecords: ShowtimeSeat[] = seatRecordsRaw.map((r) => ({
      id: String(r.id),
      showtime_id: String(r.showtime_id),
      seat_id: String(r.seat_id),
      status: r.status as "AVAILABLE" | "LOCKED" | "BOOKED",
      price: Number(r.price ?? 0),
      locked_at: r.locked_at ? String(r.locked_at) : null,
      locked_by: r.locked_by ? String(r.locked_by) : null,
    }));

    console.log("🔍 Seat records found:", seatRecords.length);

    // ตรวจสอบว่าเก้าอี้ถูกล็อกโดยผู้ใช้งานปัจจุบันหรือไม่
    const invalidSeats = seatRecords.filter(
      (seat) => seat.locked_by !== session.user.id || seat.status !== "LOCKED"
    );

    if (invalidSeats.length > 0) {
      console.log("❌ Invalid seats:", invalidSeats);
      return res.status(400).json({
        error: "Some seats are not locked by you or have expired",
        invalidSeats: invalidSeats.map((s) => s.id),
      });
    }

    // สร้าง booking
    const bookingResult = await sql`
      INSERT INTO booking (id, user_id, showtime_id, status, total_price, created_at, updated_at)
      VALUES (gen_random_uuid(), ${session.user.id}, ${showtimeId}, 'PAID', ${totalPrice}, NOW(), NOW())
      RETURNING id
    `;
    const bookingId = String(bookingResult[0].id);
    console.log("✅ Created booking:", bookingId);

    // สร้าง booking_seat
    for (const seatRecord of seatRecords) {
      await sql`
        INSERT INTO booking_seat (id, booking_id, seat_id, price)
        VALUES (gen_random_uuid(), ${bookingId}, ${seatRecord.seat_id}, ${seatRecord.price})
      `;
    }
    console.log("✅ Created booking_seats:", seatRecords.length);

    // อัปเดต showtime_seat เป็น BOOKED
    await sql`
      UPDATE showtime_seat
      SET status = 'BOOKED', locked_by = NULL, locked_at = NULL
      WHERE showtime_id = ${showtimeId}
      AND id = ANY(${seats})
    `;
    console.log("✅ Updated showtime_seats to BOOKED");

    // ส่ง event real-time ผ่าน Ably
    const channel = ably.channels.get(`showtime:${showtimeId}`);
    for (const seatId of seats) {
      await channel.publish("update", {
        seatId,
        status: "BOOKED",
        locked_by: null,
        locked_at: null,
      });
    }
    console.log("✅ Published Ably events");

    // อัปเดต coupon ถ้ามี
    if (couponId) {
      await sql`
        UPDATE coupon
        SET used_count = used_count + 1
        WHERE id = ${couponId}
      `;
      console.log("✅ Updated coupon usage");
    }

    return res.status(200).json({
      success: true,
      bookingId: bookingId,
      message: "Booking completed successfully",
    });
  } catch (error) {
    console.error("❌ Error completing booking:", error);
    return res.status(500).json({
      error: "Failed to complete booking",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
