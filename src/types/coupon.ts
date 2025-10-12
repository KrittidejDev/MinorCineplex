// types/coupon.ts
export interface CouponCardData {
  id: string;
  code: string;
  title_en: string;
  title_th: string;
  discount: number;
  expiresAt?: string | null;
  image?: string | null;
  is_collected?: boolean;
}

export interface APICoupon {
  //GET coupon
  id: number;
  code: string;
  title_en: string;
  title_th: string;
  discription_en: string;
  discription_th: string;
  discount_type: string;
  discount_value: number;
  min_amount: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  start_date: string;
  end_date?: string | null;
  status: string;
  image: string | null;
  category_id: number | null;
  created_at: string;
  updated_at: string;
  is_collected?: boolean;
}

export interface CreateCouponInput {
  code: string;
  title_en?: string;
  title_th?: string;
  discription_en?: string;
  discription_th?: string;
  discount_value: number;
  start_date: Date;
  end_date: Date;
  image?: string | null; // <- ปรับให้รองรับ null
  is_collected?: boolean;
  status?: string;
}
