import { NextApiRequest, NextApiResponse } from "next";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { moviesRepo } from "@/repositories/moviesRepo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const count = await moviesRepo.updateMovieStatusToNowShowing();
    return res.status(200).json({
      message: `อัพเดท ${count} ภาพยนตร์เป็น NOW_SHOWING เมื่อ ${format(
        new Date(),
        "yyyy-MM-dd HH:mm:ss",
        { locale: th }
      )}`,
      count,
    });
  } catch (error) {
    console.error("Error in API update-status:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
}
