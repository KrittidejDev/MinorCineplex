export interface TranslationData {
  name: string;
  description?: string;
}

export interface CinemaDTO {
  id: string;
  slug: string;
  name: string;
  translations?: {
    en?: TranslationData;
    th?: TranslationData;
  } | null;
  address: string;
  phone?: string | null;
  city?: string | null;
  city_en?: string | null;
  group?: string | null;
  group_en?: string | null;
  lat?: number | null;
  lng?: number | null;
  icon_url?: string | null;
  distance_text?: string | null;
  distance_text_th?: string | null;
  provinceTh?: string;
  provinceEn?: string;
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

export interface CinemaWithDistance extends CinemaDTO {
  distance?: number | null;
  distance_text?: string;
  distance_text_th?: string;
}

export interface CinemaByProvince {
  provinceEn?: string;
  provinceTh?: string;
  cinemas: (CinemaDTO | CinemaWithDistance)[];
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

export interface GenreItem {
  genre: {
    id: string;
    slug: string;
    name: string;
    translations?: {
      en?: { name: string };
      th?: { name: string };
    } | null;
    created_at: Date;
    updated_at: Date;
  };
}

export interface SummaryData {
  movie: {
    poster_url: string | "";
    title: string;
    genres: GenreItem[];
    languages?: { language: { name: string; code: string } }[];
  };
  cinema?: {
    id: string;
    name: string;
    address: string;
    translations?: {
      en?: { name: string; description?: string };
      th?: { name: string; description?: string };
    };
  };
  hall: {
    name: string;
  };
  date: string | Date;
  time_slot?: {
    name: string;
    start_time: string;
    end_time?: string;
  };
}

export interface Genre {
  id: string;
  slug: string;
  name: string;
  translations?: {
    en?: { name: string };
    th?: { name: string };
  } | null;
  created_at: Date;
  updated_at: Date;
}

export interface MovieDTO {
  id: string;
  slug: string;
  title: string;
  translations?: Record<string, { title: string; description?: string }> | null;
  duration_min: number;
  poster_url?: string;
  trailer_url?: string;
  rating?: string;
  release_date?: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
  genres?: Genre[];
}

export interface ShowtimeMovieData {
  id: string;
  title: string;
  description?: string;
  poster_url?: string;
  genre?: string; // หรือ Genre[]
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

export interface HallDTO {
  id: string;
  slug: string;
  name: string;
  seat_count: number;
  cinema_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface TimeSlotDTO {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  created_at: Date;
  updated_at: Date;
}

export interface ShowtimeDTO {
  id: string;
  movie_id: string;
  hall_id: string;
  cinema_id: string;
  time_slot_id: string;
  date: Date;
  price: number;
  created_at: Date;
  updated_at: Date;
  movie: MovieDTO;
  hall: HallDTO;
  time_slot: TimeSlotDTO;
}

export interface CinemaShowtimesResponse {
  cinema: CinemaDTO;
  movies: MovieDTO[];
  halls: HallDTO[];
  showtimes: ShowtimeDTO[];
}

export interface ShowtimeWithTimeslot {
  id: string;
  price: number;
  date: Date;
  timeslot: TimeSlotDTO;
}

export interface HallWithShowtimes extends HallDTO {
  showtimes: ShowtimeWithTimeslot[];
}

export interface MovieWithHalls {
  movie: MovieDTO;
  halls: HallWithShowtimes[];
}

export interface ShowtimeWithRelations {
  id: string;
  movie_id: string;
  hall_id: string;
  cinema_id: string;
  time_slot_id: string;
  date: Date;
  price: number;
  created_at: Date;
  updated_at: Date;
  movie: MovieDTO;
  hall: HallDTO;
  time_slot: TimeSlotDTO;
}

export interface Seat {
  id: string;
  showtime_id: string;
  seat_number: string;
  row: string;
  col: string;
  number?: string;
  status: "AVAILABLE" | "RESERVED" | "BOOKED" | "LOCKED";
  price?: number;
  locked_by_user_id?: string | null;
  locked_until?: number | null;
  seat_template?: {
    row: string;
    col: string;
    seat_number: string;
    number: string;
  };
}

export interface SeatRow {
  row: string;
  seats: Seat[];
}

export type SeatRowData = SeatRow;

export interface BookingInfo {
  id: string;
  movie: {
    id: string;
    title: string;
    poster_url?: string | "";
    duration_min: number;
    rating?: string;
    genres: { genre: Genre }[];
    languages?: { language: { name: string; code: string } }[];
  };
  cinema: {
    id: string;
    name: string;
    address: string;
    translations?: {
      en?: { name: string; description?: string };
      th?: { name: string; description?: string };
    };
  };
  hall: {
    id: string;
    name: string;
    seat_count?: number;
  };
  time_slot?: {
    id: string;
    name?: string;
    start_time: string;
    end_time?: string;
  };
  date: string;
  time?: string;
  price: number;
  seats: SeatRow[];
}
