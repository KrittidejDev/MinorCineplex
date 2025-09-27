import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export type CreateCouponInput = {
  code: string;
  discount: number;
  expiresAt: Date;
  discountType?: 'percentage' | 'fixed'; // default: percentage
  minAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  status?: 'active' | 'inactive';       // default: active
  categoryId?: number;
};

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
        discountType: data.discountType ?? "percentage",
        discountValue: data.discount,
        minAmount: data.minAmount ?? null,
        maxDiscount: data.maxDiscount ?? null,
        usageLimit: data.usageLimit ?? null,
        usedCount: 0,
        startDate: new Date(),
        endDate: data.expiresAt,
        status: data.status ?? "active",
        categoryId: data.categoryId ?? null,
      },
    });
  }