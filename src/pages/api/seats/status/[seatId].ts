import { PrismaClient } from "@/generated/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { seatId } = req.query;

  if (!seatId || typeof seatId !== "string") {
    console.error("Invalid seatId:", seatId);
    return res.status(400).json({ error: "Invalid seat ID format" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const seat = await prisma.showtimeSeat.findUnique({
      where: { id: seatId as string },
      select: {
        id: true,
        status: true,
        locked_by_user_id: true,
        locked_until: true,
        price: true,
      },
    });

    if (!seat) {
      console.error("Seat not found:", seatId);
      return res.status(404).json({ error: `Seat ${seatId} not found` });
    }

    // console.log(`Fetched status for seat ${seatId}`);
    res.status(200).json(seat);
  } catch (error) {
    console.error("Error fetching seat status:", error);
    res.status(500).json({ error: "Failed to fetch seat status" });
  } finally {
    await prisma.$disconnect();
  }
}
