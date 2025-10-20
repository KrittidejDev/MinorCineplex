import type { NextApiRequest, NextApiResponse } from "next";
import { cinemaService } from "@/services/cinemaService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { city, group, name, page, limit } = req.query;

      const result = await cinemaService.getCinemas(
        { city: city as string, group: group as string, name: name as string },
        { page: Number(page) || 1, limit: Number(limit) || 1000 }
      );

      return res.status(200).json(result);
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error: unknown) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่คาดคิด";
    return res.status(500).json({ message });
  }
}
