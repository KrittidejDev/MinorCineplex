import { getCoupons, createCoupons } from "@/services/couponService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const coupons = await getCoupons();
      return res.status(200).json({ coupons });
    }

    if (req.method === "POST") {
      const {
        slug,
        code,
        translations,
        discount_type,
        discount_value,
        buy_quantity,
        get_quantity,
        gift_type,
        gift_details,
        start_date,
        end_date,
        image_url,
        status,
        min_amount,
        max_discount,
        usage_limit,
        cinema_id,
        movie_id,
      } = req.body;

      if (!slug || !discount_type || discount_value == null || !start_date || !end_date) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newCoupon = await createCoupons({
        slug,
        code,
        translations,
        discount_type,
        discount_value: Number(discount_value),
        buy_quantity: buy_quantity ? Number(buy_quantity) : undefined,
        get_quantity: get_quantity ? Number(get_quantity) : undefined,
        gift_type,
        gift_details,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        image_url,
        status,
        min_amount: min_amount ? Number(min_amount) : undefined,
        max_discount: max_discount ? Number(max_discount) : undefined,
        usage_limit: usage_limit ? Number(usage_limit) : undefined,
        cinema_id,
        movie_id,
      });

      return res.status(201).json({ coupon: newCoupon });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Server Error";
    return res.status(500).json({ error: message });
  }
}
