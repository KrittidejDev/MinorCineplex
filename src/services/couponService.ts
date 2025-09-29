import * as couponRepo from "../repositories/couponRepository";

export const getCoupons = async () => {
  const coupons = await couponRepo.getMany();
  return coupons;
};

export const getCouponById = async (id: number) => {
  const coupons = await couponRepo.getById(id);
  return coupons;
};

export const createCoupons = async (data: { code: string; discount: number; expiresAt: Date }) => {
    return couponRepo.create({
      code: data.code,
      discount: data.discount,
      expiresAt: data.expiresAt,
      discountType: "percentage", // default
      status: "active",           // default
    });
  }