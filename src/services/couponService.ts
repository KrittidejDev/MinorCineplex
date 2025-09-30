import * as couponRepo from "../repositories/couponRepository";
import { CreateCouponInput } from "@/types/coupon";

export const getCoupons = async () => {
  return couponRepo.getMany();
};

export const getCouponById = async (id: number) => {
  return couponRepo.getById(id);
};

export const createCoupons = async (data: CreateCouponInput) => {
  return couponRepo.create({
    code: data.code,
    title_en: data.title_en ?? "",
    title_th: data.title_th ?? "",
    discription_en: data.discription_en ?? "",
    discription_th: data.discription_th ?? "",
    discount_value: data.discount_value,
    start_date: new Date(),
    end_date: data.end_date,
  });
};
