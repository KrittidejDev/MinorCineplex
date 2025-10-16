// repositories/userCouponRepository.ts
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// เช็คว่าผู้ใช้เก็บคูปองไปหรือยัง
export const getUserCoupon = (userId: string, couponId: string) => {
  return prisma.userCoupon.findUnique({
    where: {
      user_id_coupon_id: { user_id: userId, coupon_id: couponId },
    },
  });
};

// ผู้ใช้กดรับคูปอง
export const collectCoupon = async (userId: string, couponId: string) => {
  return prisma.userCoupon.upsert({
    where: {
      user_id_coupon_id: { user_id: userId, coupon_id: couponId },
    },
    update: {
      is_collected: true,
      collected_at: new Date(),
    },
    create: {
      user_id: userId,
      coupon_id: couponId,
      is_collected: true,
      collected_at: new Date(),
    },
  });
};
