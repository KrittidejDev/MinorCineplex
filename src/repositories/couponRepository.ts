import { PrismaClient } from "@/generated/prisma";
import { CreateCouponInput } from "@/types/coupon";

const prisma = new PrismaClient();

// Input type สำหรับการสร้าง coupon (เฉพาะ required + optional ที่สำคัญ)


export const getMany = () => {
  return prisma.coupon.findMany();
};

export const getById = (id: number) => {
  return prisma.coupon.findUnique({ where: { id } });
};

export const create = async (data: CreateCouponInput) => {
  return prisma.coupon.create({
    data: {
      code: data.code,
      title_en: data.title_en ?? "",
      title_th: data.title_th ?? "",
      discription_en: data.discription_en ?? "",
      discription_th: data.discription_th ?? "",
      discount_type: "PERCENTAGE",   // default
      discount_value: data.discount_value,
      used_count: 0,
      start_date: new Date(),
      end_date: data.end_date,
      status: "ACTIVE",              // default
      image: null,                   // default
    },
  });
};
