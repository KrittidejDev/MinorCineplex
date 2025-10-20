export enum MovieStatus {
  COMING_SOON = "COMING_SOON",
  NOW_SHOWING = "NOW_SHOWING",
  ENDED = "ENDED",
}

export enum SeatStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  BOOKED = "BOOKED",
}

export enum BookingStatus {
  PENDING = "PENDING",
  RESERVED = "RESERVED",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export enum CouponStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  EXPIRED = "EXPIRED",
}

export enum DiscountType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
  BUY_X_GET_Y = "BUY_X_GET_Y",
  GIFT = "GIFT",
}

export enum GiftType {
  POPCORN = "POPCORN",
  COUPON_CODE = "COUPON_CODE",
  OTHER = "OTHER",
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  QR_CODE = "QR_CODE",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}
