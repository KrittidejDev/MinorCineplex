import { PrismaClient, Prisma } from "@/generated/prisma";
import { CreateCouponInput } from "@/types/coupon";

const prisma = new PrismaClient();

function parseDate(value?: Date | string | null): Date {
  if (!value) throw new Error("Invalid date");
  const d = new Date(value);
  if (isNaN(d.getTime())) throw new Error("Invalid date");
  return d;
}

// แปลง GiftDetails ให้เป็น Prisma.JsonValue
function toJsonValue<T>(obj?: T): Prisma.InputJsonValue | undefined {
  if (!obj) return undefined;
  return obj as unknown as Prisma.InputJsonValue;
}

export const getMany = () => prisma.coupon.findMany();

export const getById = (id: string) =>
  prisma.coupon.findUnique({ where: { id } });

export const create = async (data: CreateCouponInput) => {
  return prisma.coupon.create({
    data: {
      slug: data.slug,
      code: data.code ?? undefined,
      translations: toJsonValue(data.translations),
      discount_type: data.discount_type,
      discount_value: data.discount_value ?? undefined,
      buy_quantity: data.buy_quantity ?? undefined,
      get_quantity: data.get_quantity ?? undefined,
      gift_type: data.gift_type ?? undefined,
      gift_details: toJsonValue(data.gift_details),
      status: data.status ?? "ACTIVE",
      image_url: data.image_url ?? undefined,
      start_date: parseDate(data.start_date),
      end_date: parseDate(data.end_date),
      min_amount: data.min_amount ?? undefined,
      max_discount: data.max_discount ?? undefined,
      usage_limit: data.usage_limit ?? undefined,
      cinema_id: data.cinema_id ?? undefined,
      movie_id: data.movie_id ?? undefined,
    },
  });
};

export const update = async (id: string, data: Partial<CreateCouponInput>) => {
  return prisma.coupon.update({
    where: { id },
    data: {
      slug: data.slug ?? undefined,
      code: data.code ?? undefined,
      translations: toJsonValue(data.translations),
      discount_type: data.discount_type ?? undefined,
      discount_value: data.discount_value ?? undefined,
      buy_quantity: data.buy_quantity ?? undefined,
      get_quantity: data.get_quantity ?? undefined,
      gift_type: data.gift_type ?? undefined,
      gift_details: toJsonValue(data.gift_details),
      status: data.status ?? undefined,
      image_url: data.image_url ?? undefined,
      start_date: data.start_date ? parseDate(data.start_date) : undefined,
      end_date: data.end_date ? parseDate(data.end_date) : undefined,
      min_amount: data.min_amount ?? undefined,
      max_discount: data.max_discount ?? undefined,
      usage_limit: data.usage_limit ?? undefined,
      cinema_id: data.cinema_id ?? undefined,
      movie_id: data.movie_id ?? undefined,
    },
  });
};
