import * as couponRepo from "../repositories/couponRepository";

export const getCoupons = async () => {
  const coupons = await couponRepo.getMany();
  return coupons;
};

export const getCouponById = async (id) => {
  const coupons = await couponRepo.getById(id);
  return coupons;
};

