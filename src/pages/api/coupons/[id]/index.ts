// api/coupons/[id]/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getCouponById, updateCouponById, deleteCouponById } from "@/services/couponService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Coupon ID is required" });
  }

  const couponId = id; // ใช้ string ตรงๆ

  try {
    const session = await getServerSession(req, res, authOptions);
    const userId = session?.user?.id;

    if (req.method === "GET") {
      const coupon = await getCouponById(couponId);
      if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }

      let is_collected = false;
      if (userId) {
        const userCoupon = await prisma.userCoupon.findUnique({
          where: { user_id_coupon_id: { user_id: userId, coupon_id: couponId } },
        });
        is_collected = !!userCoupon?.is_collected;
      }

      return res.status(200).json({ coupon, is_collected });
    }

    if (req.method === "DELETE") {
      // ✅ ต้อง login + เป็น admin
      const session = await getServerSession(req, res, authOptions);
      
      if (!session?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      if (session.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      await deleteCouponById(id);
      return res.status(200).json({ 
        success: true, 
        message: "Coupon deleted successfully" 
      });
    }

    if (req.method === "PUT") {
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

      const updatedCoupon = await updateCouponById(couponId, {
        slug,
        code,
        translations,
        discount_type,
        discount_value,
        buy_quantity,
        get_quantity,
        gift_type,
        gift_details,
        image_url,
        status,
        min_amount,
        max_discount,
        usage_limit,
        cinema_id,
        movie_id,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
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
