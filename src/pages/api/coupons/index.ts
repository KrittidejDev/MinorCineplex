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
      const {
        title_en,
        title_th,
        discription_en,
        discription_th,
        code,
        discount_value,
        start_date,
        end_date,
        image,
        is_collected,
      } = req.body;

      // ตรวจสอบว่ามีค่าจำเป็น
      if (!code || !discount_value || !start_date || !end_date) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newCoupon = await createCoupons({
        code,
        title_en,
        title_th,
        discription_en,
        discription_th,
        discount_value: Number(discount_value),
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        image,
        is_collected,
      });

      return res.status(201).json({ coupon: newCoupon });
    }

    return res.status(405).end();
  } catch (err: unknown) {
    console.error(err);
    
    let message = "Server Error";
    if (err instanceof Error) {
      message = err.message;
    }
  
    return res.status(500).json({ error: message });
  }
  
}
