import { getCinemasDetail } from "@/services/cinemaService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid cinema ID" });
  }

  try {
    const cinemaDetail = await getCinemasDetail(id);
    res.status(200).json({ cinemaDetail });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
  return res.status(500).json({ error: "Server Error" });
}
