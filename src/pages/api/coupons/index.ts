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
      const { title_en, title_th, discription_en, discription_th, code, discount, expiresAt, start_date } = req.body;

      const newCoupon = await createCoupons({
        title_en,
        title_th, 
        discription_en,
        discription_th,
        code,
        start_date ,
        discount_value: Number(discount),
        end_date: new Date(expiresAt),
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