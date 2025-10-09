import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import * as couponService from "@/services/couponService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;
  const couponId = Number(req.query.id);

  if (isNaN(couponId)) {
    return res.status(400).json({ error: "Invalid coupon ID" });
  }

  if (req.method === "GET") {
    try {
      const existing = await couponService.getUserCouponByUser(userId, couponId);
      if (existing?.is_collected) {
        return res.status(200).json({ collected: true, collected_at: existing.collected_at });
      }
      return res.status(200).json({ collected: false });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const existing = await couponService.getUserCouponByUser(userId, couponId);
      if (existing?.is_collected) {
        return res.status(200).json({ success: false, message: "Coupon already collected" });
      }

      const collected = await couponService.collectCouponByUser(userId, couponId);
      return res.status(200).json({ success: true, collected });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
