import { getCinemasDetail } from "@/services/cinemaService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, date } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid cinema ID" });
  }

  try {
    const cinemaDetail = await getCinemasDetail(id, date as string | undefined);

    if (!cinemaDetail) {
      return res.status(404).json({ error: "Cinema not found" });
    }

    return res.status(200).json({ data: cinemaDetail, status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching cinema detail:", error);

    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: "Server Error" });
  }
}
