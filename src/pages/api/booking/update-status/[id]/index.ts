import { PrismaClient } from "@/generated/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { status } = req.body;

  if (!id || typeof id !== "string") {
    console.error("Invalid booking ID:", id);
    return res.status(400).json({ error: "Invalid booking ID format" });
  }

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (
    !["PENDING", "RESERVED", "PAID", "CANCELLED", "EXPIRED"].includes(status)
  ) {
    console.error("Invalid booking status:", status);
    return res.status(400).json({ error: `Invalid booking status: ${status}` });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: id as string },
    });

    if (!booking) {
      console.error("Booking not found:", id);
      return res.status(404).json({ error: `Booking ${id} not found` });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: id as string },
      data: { status },
    });

    console.log(`Booking ${id} updated to status ${status}`);
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  } finally {
    await prisma.$disconnect();
  }
}
