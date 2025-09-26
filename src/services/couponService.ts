import * as couponRepo from "../repositories/couponRepository";

export const getCoupons = async () => {
  const coupons = await couponRepo.getMany();
  return coupons;
};

export const getCouponById = async (id: number) => {
  const coupons = await couponRepo.getById(id);
  return coupons;
};

export const createCoupon = async (data: {
  code: string;
  discount: number;
  expiresAt: Date;
}) => {
  return await couponRepo.create(data);
};