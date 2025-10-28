import { PrismaClient } from "@/generated/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { seatId } = req.query;
  const { status, userId } = req.body;

  if (!seatId || typeof seatId !== "string") {
    console.error("Invalid seatId:", seatId);
    return res.status(400).json({ error: "Invalid seat ID format" });
  }

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!["AVAILABLE", "RESERVED", "BOOKED", "LOCKED"].includes(status)) {
    console.error("Invalid seat status:", status);
    return res.status(400).json({ error: `Invalid seat status: ${status}` });
  }

  if (status === "LOCKED" && (!userId || typeof userId !== "string")) {
    console.error("Invalid userId for locking:", userId);
    return res.status(400).json({ error: "Invalid user ID for locking" });
  }

  try {
    const seat = await prisma.showtimeSeat.findUnique({
      where: { id: seatId as string },
    });

    if (!seat) {
      console.error("Seat not found:", seatId);
      return res.status(404).json({ error: `Seat ${seatId} not found` });
    }

    const now = new Date();
    if (
      seat.locked_until &&
      new Date(seat.locked_until) > now &&
      seat.locked_by_user_id !== userId
    ) {
      console.error("Seat locked by another user:", {
        seatId,
        locked_by_user_id: seat.locked_by_user_id,
      });
      return res.status(403).json({ error: "Seat is locked by another user" });
    }

    const updatedSeat = await prisma.showtimeSeat.update({
      where: { id: seatId as string },
      data: {
        status,
        locked_by_user_id: status === "LOCKED" ? userId : null,
        locked_until:
          status === "LOCKED" ? new Date(Date.now() + 5 * 60 * 1000) : null,
      },
    });

    // console.log(
    //   `Seat ${seatId} updated to ${status} by user ${userId || "none"}`
    // );
    res.status(200).json(updatedSeat);
  } catch (error) {
    console.error("Error updating seat:", error);
    res.status(500).json({ error: "Failed to update seat status" });
  } finally {
    await prisma.$disconnect();
  }
}
