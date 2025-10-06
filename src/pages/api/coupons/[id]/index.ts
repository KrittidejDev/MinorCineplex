import type { NextApiRequest, NextApiResponse } from "next";
import { getCouponById, updateCouponById } from "@/services/couponService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Coupon ID is required" });
  }

  const couponId = Number(id);
  if (isNaN(couponId)) {
    return res.status(400).json({ error: "Invalid coupon ID" });
  }

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
