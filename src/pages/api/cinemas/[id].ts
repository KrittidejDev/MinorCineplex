import { getCinemaById } from "@/services/cinemaService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {id} = req.query
  try {
    const cinema = await getCinemaById(Number(id));
    res.status(200).json({ cinema });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
  return res.status(500).json({ error: "Server Error" });
}