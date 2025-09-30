// types/coupon.ts
export interface CouponCardData {
    id: number
    code: string
    title_en: string
    title_th: string
    discount: number
    expiresAt?: string | null
  }
  
export interface APICoupon { //GET coupon
    id: number
    code: string
    title_en: string
    title_th: string
    discription_en: string
    discription_th: string
    discountType: string
    discountValue: number
    minAmount: number | null
    maxDiscount: number | null
    usageLimit: number | null
    usedCount: number
    startDate: string
    endDate?: string | null
    status: string
    image: string | null
    categoryId: number | null
    createdAt: string
    updatedAt: string
  }

  export type CreateCouponInput = {
    code: string;                 // จำเป็น
    title_en?: string;            // ไม่จำเป็น
    title_th?: string;            // ไม่จำเป็น
    discription_en?: string;      // ไม่จำเป็น
    discription_th?: string;      // ไม่จำเป็น
    discount_value: number; 
    start_date: Date;            // จำเป็น
    end_date: Date;              // จำเป็น
  };