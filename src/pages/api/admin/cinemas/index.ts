import type { NextApiRequest, NextApiResponse } from "next";
import { cinemaService } from "@/services/cinemaService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      if (req.query.type === "dropdown") {
        const result = await cinemaService.getCinemasForDropdown();
        return res.status(200).json(result);
      }
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}
