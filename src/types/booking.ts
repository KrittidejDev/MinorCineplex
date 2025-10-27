export enum BookingStatus {
  PENDING = "PENDING",
  RESERVED = "RESERVED",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}
export interface BookingAPIResponse {
  booking_id: string;
  public_id: string;
  cinema_name: { th: string; en: string };
  movie_title: { th: string; en: string };
  movie_description: { th: string | null; en: string | null };
  movie_poster: string | null;
  genres: { th: string | null; en: string | null }[];
  languages: string[];
  date: { th: string; en: string };
  time: string;
  hall: { th: string; en: string };
  seats: string[];
  payment_method: { th: string; en: string };
  total_price: number;
  user_id: string;
  showtime_id: string;
  booked_date: { th: string; en: string };
  status: BookingStatus;
  showtime?: {
    cinema?: {
      city?: string;
      city_en?: string;
    };
  };
}
