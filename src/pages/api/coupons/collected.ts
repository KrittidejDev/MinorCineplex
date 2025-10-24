// api/coupons/collected.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { getCoupons } from "@/services/couponService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const coupons = await getCoupons();

    const collectedCoupons = await Promise.all(
      coupons.map(async (c) => {
        const userCoupon = await prisma.userCoupon.findUnique({
          where: {
            user_id_coupon_id: { user_id: userId, coupon_id: c.id },
          },
          select: {
            is_collected: true,
            collected_at: true,
          },
        });

        if (!userCoupon?.is_collected) return null;

        return {
          ...c,
          collected_at: userCoupon.collected_at,
        };
      })
    );

    const filtered = collectedCoupons.filter((c) => c !== null);

    return res.status(200).json({ coupons: filtered });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch collected coupons" });
  }
}
