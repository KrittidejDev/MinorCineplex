// types/coupon.ts

// กำหนด type สำหรับรายละเอียดของ gift
export type GiftDetails =
  | { item: string; size?: string }        // สำหรับ POPCORN
  | { code: string }                        // สำหรับ COUPON_CODE
  | Record<string, unknown>;                // สำหรับ OTHER

// ข้อมูลคูปองที่จะแสดงบน card
export interface CouponCardData {
  id: string;
  code?: string | null;
  slug: string;
  translations?: Record<string, { name: string; description?: string }>; // เช่น { en: { name: '', description: '' }, th: {...} }
  discount_value?: number | null;
  discount_type: "FIXED" | "PERCENTAGE" | "BUY_X_GET_Y" | "GIFT";
  buy_quantity?: number;   // สำหรับ BUY_X_GET_Y
  get_quantity?: number;   // สำหรับ BUY_X_GET_Y
  gift_type?: "POPCORN" | "COUPON_CODE" | "OTHER"; // สำหรับ GIFT
  gift_details?: GiftDetails;
  expiresAt?: string | null;
  end_date?: string | null;
  image_url?: string | null;
  is_collected?: boolean;
}

// Response wrapper
export interface CouponsData {
  coupons: CouponCardData[];
}

// API Response type
export interface APICoupon {
  id: string;
  code?: string | null;
  slug: string;
  translations?: Record<string, { name: string; description?: string }>;
  discount_type: "FIXED" | "PERCENTAGE" | "BUY_X_GET_Y" | "GIFT";
  discount_value?: number | null;
  buy_quantity?: number;
  get_quantity?: number;
  gift_type?: "POPCORN" | "COUPON_CODE" | "OTHER";
  gift_details?: GiftDetails;
  min_amount?: number | null;
  max_discount?: number | null;
  usage_limit?: number | null;
  used_count: number;
  start_date: string;
  end_date: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  image_url?: string | null;
  created_at: string;
  updated_at: string;
  is_collected?: boolean;
}

// Input type สำหรับสร้างคูปอง
export interface CreateCouponInput {
  slug: string;
  code?: string | null;
  translations?: Record<string, { name: string; description?: string }>;
  discount_type: "FIXED" | "PERCENTAGE" | "BUY_X_GET_Y" | "GIFT";
  discount_value?: number | null;
  buy_quantity?: number;
  get_quantity?: number;
  gift_type?: "POPCORN" | "COUPON_CODE" | "OTHER";
  gift_details?: GiftDetails;
  start_date: Date | string;
  end_date: Date | string;
  status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
  image_url?: string | null;
  min_amount?: number | null;
  max_discount?: number | null;
  usage_limit?: number | null;
  cinema_id?: string | null;
  movie_id?: string | null;
}
