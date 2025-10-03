import type { NextApiRequest, NextApiResponse } from "next";
import { getCouponById, updateCouponById, collectCouponByUser } from "@/services/couponService";

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
    const userId = req.headers["x-user-id"] as string; 

    if (req.method === "GET") {
      const coupon = await getCouponById(couponId);
      if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
      return res.status(200).json({ coupon });
    }

    if (req.method === "PUT") {
      const updatedCoupon = await updateCouponById(couponId, req.body);
      return res.status(200).json({ coupon: updatedCoupon });
    }

    if (req.method === "POST") {
      // 🔹 ผู้ใช้กดรับคูปอง
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const collected = await collectCouponByUser(userId, couponId);
      return res.status(200).json({ collected });
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
