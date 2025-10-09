import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/lib/prisma'
import { getCoupons } from '@/services/couponService'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(405).end()

  // ดึง session ของ user
  const session = await getServerSession(req, res, authOptions)
  const userId = session?.user?.id

  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  // ดึง coupon ทั้งหมด
  const coupons = await getCoupons()

  // map เพิ่ม collected แล้ว filter เฉพาะ collected: true
  const collectedCoupons = await Promise.all(
    coupons.map(async (c) => {
      const userCoupon = await prisma.userCoupon.findUnique({
        where: { user_id_coupon_id: { user_id: userId, coupon_id: c.id } },
      })
      return { ...c, collected: !!userCoupon?.is_collected }
    })
  ).then((arr) => arr.filter((c) => c.collected))

  return res.status(200).json({ coupons: collectedCoupons })
}
