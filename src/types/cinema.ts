export interface CinemaDTO {
  id: string;
  slug: string;
  name: string;
  translations?: Record<string, string> | null;
  address: string;
  phone?: string | null;
  city?: string | null;
  city_en?: string | null;
  group?: string | null;
  group_en?: string | null;
  lat?: number | null;
  lng?: number | null;
  icon_url?: string | null;
}

export interface CinemaFilters {
  city?: string;
  group?: string;
  name?: string;
}

export interface Pagination {
  page?: number;
  limit?: number;
}

export interface CinemaType {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  lat?: number | null;
  lng?: number | null;
  provinceEn?: string;
  provinceTh?: string;
}

export interface CinemaWithDistance extends CinemaType {
  distance?: number | null; // Optional และรองรับ null
  distance_text?: string;
  distance_text_th?: string;
}

export interface CinemaByProvince {
  provinceEn?: string;
  provinceTh?: string;
  cinemas: CinemaWithDistance[]; // ใช้ CinemaWithDistance
}

export interface UseNearbyCinemasReturn {
  cinemas: CinemaByProvince[];
  loading: boolean;
  error: string | null;
  refetch: (filter?: string) => void;
}

export interface SelectedSeat {
  id: string;
  seat_number: string;
  price: number;
  row: string;
}

export interface Seat {
  id: string;
  row: string;
  number: string;
  seat_number: string;
  status: string;
  price: number;
  seat: {
    id: string;
    seat_number: string;
    row: string;
    col: string;
  };
}

export interface SeatRowData {
  row: string;
  seats: Seat[];
}

export interface BookingInfo {
  id: string; // ID ของรอบฉาย (showtime)
  price: number; // ราคาตั๋ว
  seats: SeatRowData[]; // ข้อมูลที่นั่ง
}

export interface PendingSeat {
  id: string;
  seat_number: string;
  row: string;
  status: string;
  price: number;
  locked_by?: string;
  showtimeId?: string;
}

export interface BillInfo {
  totalSelected: SelectedSeat[];
  lockSeats: () => void;
  totalPrice?: number;
}

export interface SummaryData {
  movie: {
    poster_url: string;
    title: string;
    genre: string;
  };
  hall: {
    cinema: {
      name: string;
    };
    name: string;
  };
  date: string | Date;
  time_slot: {
    start_time: string;
  };
}

export interface ShowtimeMovieData {
  id: string;
  title: string;
  description?: string;
  poster_url?: string;
  genre?: string;
  duration_min?: number;
  rating?: string;
  halls: {
    hall: {
      id: string;
      name: string;
    };
    showtimes: {
      id: string;
      date: Date;
      price: number;
      available_seats: number;
      time_slot: {
        id: string;
        start_time: string;
        end_time: string;
      };
    }[];
  }[];
}

export interface CinemaDetail extends CinemaDTO {
  name_en?: string;
  description?: string;
  description_en?: string;
  opening_hours?: string;
  transportation?: string;
  movies?: ShowtimeMovieData[];
}
