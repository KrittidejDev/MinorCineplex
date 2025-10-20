// types.ts
import {
  MovieStatus,
  SeatStatus,
  BookingStatus,
  UserRole,
  CouponStatus,
  DiscountType,
  GiftType,
  PaymentMethod,
  PaymentStatus,
} from "./enums";

// Generic JSON translations
export type Translation<T = string> = {
  en?: T;
  th?: T;
};

// Cinema
export interface Cinema {
  id: string;
  slug: string;
  name: string;
  translations?: Translation<{ name: string; description: string }>;
  address: string;
  phone?: string;
  city?: string;
  city_en?: string;
  group?: string;
  group_en?: string;
  lat?: number;
  lng?: number;
  icon_url?: string;
  created_at: Date;
  updated_at: Date;
  halls?: Hall[];
  showtimes?: Showtime[];
  coupons?: Coupon[];
}

// Hall
export interface Hall {
  id: string;
  slug: string;
  name: string;
  seat_count: number;
  cinema_id: string;
  created_at: Date;
  updated_at: Date;
  cinema?: Cinema;
  showtimes?: Showtime[];
}

// SeatTemplate
export interface SeatTemplate {
  id: string;
  seat_number: string;
  row: string;
  col: string;
  created_at: Date;
  updated_at: Date;
  showtime_seats?: ShowtimeSeat[];
}

// Genre
export interface Genre {
  id: string;
  slug: string;
  name: string;
  translations?: Translation<string>;
  created_at: Date;
  updated_at: Date;
  movies?: MovieGenre[];
}

// Movie
export interface Movie {
  id: string;
  slug: string;
  title: string;
  translations?: Translation<{ title: string; description: string }>;
  duration_min: number;
  poster_url?: string;
  trailer_url?: string;
  rating?: string;
  release_date?: Date;
  status: MovieStatus;
  created_at: Date;
  updated_at: Date;
  actors?: MovieActor[];
  directors?: MovieDirector[];
  languages?: MovieLanguage[];
  genres?: MovieGenre[];
  showtimes?: Showtime[];
  coupons?: Coupon[];
}

// MovieGenre
export interface MovieGenre {
  id: string;
  movie_id: string;
  genre_id: string;
  movie?: Movie;
  genre?: Genre;
  created_at: Date;
}

// Actor
export interface Actor {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  movies?: MovieActor[];
}

// Director
export interface Director {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  movies?: MovieDirector[];
}

// Language
export interface Language {
  id: string;
  name: string;
  code: string;
  created_at: Date;
  updated_at: Date;
  movies?: MovieLanguage[];
}

// MovieActor
export interface MovieActor {
  id: string;
  movie_id: string;
  actor_id: string;
  actor?: Actor;
  movie?: Movie;
}

// MovieDirector
export interface MovieDirector {
  id: string;
  movie_id: string;
  director_id: string;
  director?: Director;
  movie?: Movie;
}

// MovieLanguage
export interface MovieLanguage {
  id: string;
  movie_id: string;
  language_id: string;
  language?: Language;
  movie?: Movie;
}

// TimeSlot
export interface TimeSlot {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  created_at: Date;
  updated_at: Date;
  showtimes?: Showtime[];
}

// Showtime
export interface Showtime {
  id: string;
  movie_id: string;
  hall_id: string;
  cinema_id: string;
  time_slot_id: string;
  date: Date;
  price: number;
  created_at: Date;
  updated_at: Date;
  hall?: Hall;
  cinema?: Cinema;
  movie?: Movie;
  time_slot?: TimeSlot;
  bookings?: Booking[];
  showtime_seats?: ShowtimeSeat[];
}

// ShowtimeSeat
export interface ShowtimeSeat {
  id: string;
  showtime_id: string;
  seat_template_id: string;
  status: SeatStatus;
  price?: number;
  locked_until?: Date;
  locked_by_user_id?: string;
  created_at: Date;
  updated_at: Date;
  seat_template?: SeatTemplate;
  showtime?: Showtime;
  user?: User;
  booking_seats?: BookingSeat[];
}

// User
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  avatar_url?: string;
  coupons?: UserCoupon[];
  bookings?: Booking[];
  payments?: Payment[];
  locked_seats?: ShowtimeSeat[];
}

// Booking
export interface Booking {
  id: string;
  public_id: string;
  user_id: string;
  showtime_id: string;
  coupon_id?: string;
  status: BookingStatus;
  total_price: number;
  created_at: Date;
  updated_at: Date;
  showtime?: Showtime;
  user?: User;
  coupon?: Coupon;
  seats?: BookingSeat[];
  payment?: Payment;
}

// BookingSeat
export interface BookingSeat {
  id: string;
  booking_id: string;
  showtime_seat_id: string;
  price: number;
  created_at: Date;
  updated_at: Date;
  booking?: Booking;
  showtime_seat?: ShowtimeSeat;
}

// Coupon
export interface Coupon {
  id: string;
  slug: string;
  code?: string;
  translations?: Translation<{ name: string; description: string }>;
  discount_type: DiscountType;
  discount_value?: number;
  buy_quantity?: number;
  get_quantity?: number;
  gift_type?: GiftType;
  gift_details?: Record<string, unknown>;
  status: CouponStatus;
  image_url?: string;
  start_date: Date;
  end_date: Date;
  max_discount?: number;
  min_amount?: number;
  usage_limit?: number;
  used_count: number;
  cinema_id?: string;
  movie_id?: string;
  created_at: Date;
  updated_at: Date;
  cinema?: Cinema;
  movie?: Movie;
  users?: UserCoupon[];
  bookings?: Booking[];
}

// UserCoupon
export interface UserCoupon {
  id: string;
  user_id: string;
  coupon_id: string;
  is_collected: boolean;
  collected_at?: Date;
  is_used: boolean;
  used_at?: Date;
  created_at: Date;
  updated_at: Date;
  coupon?: Coupon;
  user?: User;
}

// Payment
export interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  created_at: Date;
  updated_at: Date;
  booking?: Booking;
  user?: User;
}
