import { getCoupons } from "@/services/couponService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const coupon = await getCoupons();
    res.status(200).json({ coupon });
  } catch (error: any) {
    console.error(error);
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Server Error" });
  }
}
