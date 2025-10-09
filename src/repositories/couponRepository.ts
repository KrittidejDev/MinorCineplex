//repositories/couponRepository.ts
import { PrismaClient } from "@/generated/prisma";
import { CreateCouponInput } from "@/types/coupon";

const prisma = new PrismaClient();

function parseDate(value?: Date | string | null): Date {
  if (!value) throw new Error("Invalid date");
  const d = new Date(value);
  if (isNaN(d.getTime())) throw new Error("Invalid date");
  return d;
}

export const getMany = () => prisma.coupon.findMany();

export const getById = (id: string) =>
  prisma.coupon.findUnique({ where: { id } });

export const create = async (data: CreateCouponInput) => {
  return prisma.coupon.create({
    data: {
      code: data.code,
      title_en: data.title_en ?? "",
      title_th: data.title_th ?? "",
      discription_en: data.discription_en ?? "",
      discription_th: data.discription_th ?? "",
      discount_type: data.discount_type ?? "AMOUNT",
      discount_value: data.discount_value,
      start_date: parseDate(data.start_date),
      end_date: parseDate(data.end_date),
      status: data.status ?? "ACTIVE",
      image: data.image ?? null,
      min_amount: data.min_amount ?? null,
      max_discount: data.max_discount ?? null,
      usage_limit: data.usage_limit ?? null,
    },
  });
};

export const update = async (id: string, data: Partial<CreateCouponInput>) => {
  return prisma.coupon.update({
    where: { id },
    data: {
      code: data.code ?? undefined,
      title_en: data.title_en ?? undefined,
      title_th: data.title_th ?? undefined,
      discription_en: data.discription_en ?? undefined,
      discription_th: data.discription_th ?? undefined,
      discount_type: data.discount_type ?? undefined,
      discount_value: data.discount_value ?? undefined,
      start_date: data.start_date ? parseDate(data.start_date) : undefined,
      end_date: data.end_date ? parseDate(data.end_date) : undefined,
      status: data.status ?? undefined,
      image: data.image ?? undefined,
      min_amount: data.min_amount ?? undefined,
      max_discount: data.max_discount ?? undefined,
      usage_limit: data.usage_limit ?? undefined,
    },
  });
};
