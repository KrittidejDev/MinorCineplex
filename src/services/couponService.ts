// service/couponService.ts
import * as couponRepo from "@/repositories/couponRepository";
import { CreateCouponInput } from "@/types/coupon";
import * as userCouponRepo from "@/repositories/userCouponRepository";

// ดึงคูปองทั้งหมด
export const getCoupons = async () => {
  return couponRepo.getMany();
};

// ดึงคูปองตาม id
export const getCouponById = async (id: string) => {
  return couponRepo.getById(id);
};

// สร้างคูปองใหม่
export const createCoupons = async (data: CreateCouponInput) => {
  const startDate = data.start_date instanceof Date ? data.start_date : new Date(data.start_date);
  const endDate = data.end_date instanceof Date ? data.end_date : new Date(data.end_date);

  return couponRepo.create({
    ...data,
    start_date: startDate,
    end_date: endDate,
  });
};

// อัปเดตคูปองตาม id
export const updateCouponById = async (id: string, data: Partial<CreateCouponInput>) => {
  return couponRepo.update(id, data);
};

// เช็คว่าผู้ใช้เก็บคูปองไปหรือยัง
export const getUserCouponByUser = async (userId: string, couponId: string) => {
  return userCouponRepo.getUserCoupon(userId, couponId);
};

// ผู้ใช้กดรับคูปอง
export const collectCouponByUser = async (userId: string, couponId: string) => {
  return userCouponRepo.collectCoupon(userId, couponId);
};
