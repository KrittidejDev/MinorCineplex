import { getCoupons, createCoupons } from "@/services/couponService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const coupons = await getCoupons();
      return res.status(200).json({ coupons });
    }

    if (req.method === "POST") {
      const { code, discount, expiresAt } = req.body;

      const newCoupon = await createCoupons({
        code,
        discount: Number(discount),
        expiresAt: new Date(expiresAt),
      });

      return res.status(201).json({ coupon: newCoupon });
    }

    // ไม่สนใจ method อื่น ๆ
    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
}