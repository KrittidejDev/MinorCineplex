import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, SeatStatus } from "@/generated/prisma"; // ปรับ path ตามโครงสร้างโปรเจกต์
// import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { showtimeId, seatIds, userId, paymentDetails } = req.body;

  try {
    // Validate input
    if (
      !showtimeId ||
      !seatIds ||
      !userId ||
      !paymentDetails ||
      !paymentDetails.amount ||
      !paymentDetails.transactionId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // console.log("Confirming booking:", {
    //   showtimeId,
    //   seatIds,
    //   userId,
    //   paymentDetails,
    // });

    // เริ่ม transaction
    const result = await prisma.$transaction(async (tx) => {
      // ดึงข้อมูลที่นั่งจาก ShowtimeSeat
      const seatRecords = await tx.showtimeSeat.findMany({
        where: {
          showtime_id: showtimeId,
          seat_template_id: { in: seatIds },
        },
        select: {
          id: true,
          showtime_id: true,
          seat_template_id: true,
          status: true,
          price: true,
          locked_until: true,
          locked_by_user_id: true,
        },
      });
      // console.log("Seat records:", seatRecords);

      // ตรวจสอบว่าเก้าอี้ทั้งหมดถูกล็อกและล็อกโดย user
      const invalidSeats = seatRecords.filter(
        (seat) =>
          seat.status !== ("LOCKED" as unknown as SeatStatus) ||
          seat.locked_by_user_id !== userId
      );
      if (invalidSeats.length > 0) {
        throw new Error("Some seats are not available or not locked by user");
      }

      // // คำนวณราคารวม
      // const totalPrice = seatRecords.reduce((sum, seat) => sum + (seat.price || 0), 0);

      // // สร้าง Booking
      // const publicId = uuidv4().slice(0, 10); // สร้าง public_id สั้น ๆ สำหรับลิงก์
      // const booking = await tx.booking.create({
      //   data: {
      //     public_id: publicId,
      //     user_id: userId,
      //     showtime_id: showtimeId,
      //     status: "PAID",
      //     total_price: totalPrice,
      //     created_at: new Date(),
      //     updated_at: new Date(),
      //   },
      //   select: {
      //     id: true,
      //     public_id: true,
      //   },
      // });
      // console.log("Booking created:", { bookingId: booking.id, publicId: booking.public_id });

      // // สร้าง BookingSeat สำหรับแต่ละที่นั่ง
      // await Promise.all(
      //   seatRecords.map((seat) =>
      //     tx.bookingSeat.create({
      //       data: {
      //         id: uuidv4(),
      //         booking_id: booking.id,
      //         showtime_seat_id: seat.id,
      //         price: seat.price || 0,
      //         created_at: new Date(),
      //         updated_at: new Date(),
      //       },
      //     })
      //   )
      // );
      // console.log("BookingSeat records created for seats:", seatIds);

      // อัปเดต ShowtimeSeat เป็น BOOKED โดยคง locked_by_user_id
      await tx.showtimeSeat.updateMany({
        where: {
          showtime_id: showtimeId,
          seat_template_id: { in: seatIds },
        },
        data: {
          status: "BOOKED",
          locked_until: null,
        },
      });
      // console.log(
      //   "ShowtimeSeat updated to BOOKED, locked_by_user_id preserved"
      // );

      // // สร้าง Payment
      // const payment = await tx.payment.create({
      //   data: {
      //     id: uuidv4(),
      //     booking_id: booking.id,
      //     user_id: userId,
      //     amount: paymentDetails.amount,
      //     payment_method: "CREDIT_CARD",
      //     status: "COMPLETED",
      //     transaction_id: paymentDetails.transactionId,
      //     created_at: new Date(),
      //     updated_at: new Date(),
      //   },
      //   select: {
      //     id: true,
      //   },
      // });
      // console.log("Payment created:", { paymentId: payment.id });

      // return { bookingId: booking.id, publicId: booking.public_id };
      return { success: true }; // ปรับ return ให้เหมาะสมเมื่อไม่มี booking
    });

    return res.status(200).json({ success: true }); // ปรับ response ให้เหมาะสม
  } catch (error) {
    console.error("Error completing booking:", error);
    return res.status(500).json({ error: "Failed to complete booking" });
  } finally {
    await prisma.$disconnect();
  }
}
