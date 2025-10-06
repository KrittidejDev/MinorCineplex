import { PrismaClient } from "@/generated/prisma";
import { CreateCouponInput } from "@/types/coupon";

const prisma = new PrismaClient();

export const getMany = () => {
  return prisma.coupon.findMany();
};

export const getById = (id: number) => {
  return prisma.coupon.findUnique({ where: { id } });
};

export const create = async (data: CreateCouponInput) => {
  // ตรวจสอบวันที่
  if (!data.start_date || isNaN(data.start_date.getTime())) {
    throw new Error("Invalid start_date format, must be a valid Date");
  }
  if (!data.end_date || isNaN(data.end_date.getTime())) {
    throw new Error("Invalid end_date format, must be a valid Date");
  }

  return prisma.coupon.create({
    data: {
      code: data.code,
      title_en: data.title_en ?? "",
      title_th: data.title_th ?? "",
      discription_en: data.discription_en ?? "",
      discription_th: data.discription_th ?? "",
      discount_type: "PERCENTAGE", // default
      discount_value: data.discount_value,
      used_count: 0,
      start_date: data.start_date,
      end_date: data.end_date,
      status: "ACTIVE",
      image: data.image ?? null,
    },
  });
};


// 🔹 helper function สำหรับ parse date
function parseDate(value?: Date | string | null) {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

export const update = async (
  id: number,
  data: Partial<CreateCouponInput>
) => {
  return prisma.coupon.update({
    where: { id },
    data: {
      code: data.code ?? undefined,
      title_en: data.title_en ?? undefined,
      title_th: data.title_th ?? undefined,
      discription_en: data.discription_en ?? undefined,
      discription_th: data.discription_th ?? undefined,
      discount_value: data.discount_value ?? undefined,
      start_date: parseDate(data.start_date),
      end_date: parseDate(data.end_date),
      image: data.image ?? undefined,
      status: data.status ?? undefined,
    },
  });
};



