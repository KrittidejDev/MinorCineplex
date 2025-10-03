import type { NextApiRequest, NextApiResponse } from "next";
import { getCouponById, updateCouponById } from "@/services/couponService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Coupon ID is required" });
  }

  try {
    const couponId = Number(id);

    if (req.method === "GET") {
      const coupon = await getCouponById(couponId);
      if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
      return res.status(200).json({ coupon });
    }

    if (req.method === "PUT") {
      const {
        code,
        title_en,
        title_th,
        discription_en,
        discription_th,
        discount_value,
        start_date,
        end_date,
        image,
      } = req.body;

      const updatedCoupon = await updateCouponById(couponId, {
        code,
        title_en,
        title_th,
        discription_en,
        discription_th,
        discount_value,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        image,
      });

      return res.status(200).json({ coupon: updatedCoupon });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Server Error" });
  }
}
