import * as couponRepo from "@/repositories/couponRepository";
import { CreateCouponInput } from "@/types/coupon";
import * as userCouponRepo from "@/repositories/userCouponRepository";

export const getCoupons = async () => {
  return couponRepo.getMany();
};

export const getCouponById = async (id: number) => {
  return couponRepo.getById(id);
};

export const createCoupons = async (data: CreateCouponInput) => {
  // แปลง start_date / end_date เป็น Date object หากเป็น string
  const startDate = data.start_date instanceof Date ? data.start_date : new Date(data.start_date);
  const endDate = data.end_date instanceof Date ? data.end_date : new Date(data.end_date);

  return couponRepo.create({
    ...data,
    start_date: startDate,
    end_date: endDate,
  });
};

export const updateCouponById = async (
  id: number,
  data: Partial<CreateCouponInput>
) => {
  return couponRepo.update(id, data);
};

// 🔹 ผู้ใช้กดรับคูปอง
export const collectCouponByUser = async (userId: string, couponId: number) => {
  return userCouponRepo.collectCoupon(userId, couponId);
};