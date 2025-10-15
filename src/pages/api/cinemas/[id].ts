import { getCinemaById } from "@/services/cinemaService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // id จาก req.query เป็น string | string[] | undefined
  // แปลงเป็น string แบบปลอดภัย
  const cinemaId = Array.isArray(id) ? id[0] : id;

  if (!cinemaId) {
    return res.status(400).json({ error: "Cinema ID is required" });
  }

  try {
    const cinema = await getCinemaById(cinemaId);
    res.status(200).json({ cinema });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
  return res.status(500).json({ error: "Server Error" });
}
