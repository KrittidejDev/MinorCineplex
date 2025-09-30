// types/coupon.ts
export interface CouponCardData {
    id: number
    code: string
    title_en: string
    title_th: string
    discount: number
    expiresAt?: string | null
    image?: string | null 
  }
  
export interface APICoupon { //GET coupon
    id: number
    code: string
    title_en: string
    title_th: string
    discription_en: string
    discription_th: string
    discount_type: string
    discount_value: number
    min_amount: number | null
    max_discount: number | null
    usage_limit: number | null
    used_count: number
    start_date: string
    end_date?: string | null
    status: string
    image: string | null
    category_id: number | null
    created_at: string
    updated_at: string
  }

  export interface CreateCouponInput {
    code: string;
    title_en?: string;
    title_th?: string;
    discription_en?: string;
    discription_th?: string;
    discount_value: number;
    start_date: Date; // Date object
    end_date: Date;   // Date object
    image?: string;
  }
  
  