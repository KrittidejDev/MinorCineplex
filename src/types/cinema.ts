export interface CinemaType {
  id: string;
  name: string;
  name_en?: string | null;
  address: string;
  lat: number | null;
  lng: number | null;
  icon_url?: string | null;
  distance?: number | null;
  distance_text?: string;
  distance_text_th?: string;
}

export interface ShowtimeDetail {
  id: string;
  movie: {
    id: string;
    title: string;
    duration_min: number;
    poster_url?: string;
    description?: string;
  };
  time_slot: {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
  };
  date: string;
  price: number;
  seats: {
    id: string;
    status: string;
    price: number;
    seat_id: string;
    showtime_id: string;
  }[];
}

// Interface สำหรับ hall
export interface HallDetail {
  id: string;
  name: string;
  seat_count?: number | null;
  seats: {
    id: string;
    seat_number: string;
    row: string;
    col: string;
    hall_id: string;
  }[];
  showtimes: ShowtimeDetail[];
}

export interface ShowtimeMovieData {
  id: string;
  title: string;
  poster_url?: string;
  genre?: string;
  description?: string;
  halls?: {
    id: string;
    name: string;
    timeslots: {
      id: string;
      start_time: string;
      end_time: string;
    }[];
  }[];
}

// Interface สำหรับ cinema
export interface CinemaDetail {
  id: string;
  name: string;
  name_en?: string;
  address: string;
  phone?: string;
  description?: string;
  description_en?: string;
  opening_hours?: string;
  transportation?: string;
  icon_url?: string;
  halls: HallDetail[];
  movies?: ShowtimeMovieData[];
  showtimesByDay: {
    date: string; // YYYY-MM-DD
    halls: HallDetail[];
  }[];
}

export interface Seat {
  id: string;
  status: string;
  price: number;
  seat: {
    id: string;
    seat_number: string;
    row: string;
    col: string;
  };
}

export interface BillInfo {
  data?: BookingInfo | null;
  totalSelected?: SelectedSeat[];
  totalPrice?: number;
  lockSeats?: () => void;
  step?: string;
}

export interface SelectedSeat {
  id: string;
  seat_number: string;
  row: string;
  status: string;
  price: number;
  locked_by?: string | null;
  showtimeId?: string;
}

export interface Seat {
  id: string;
  row: string;
  number: string;
  status: string;
  price: number;
  seat_number?: string;
  lockExpire?: number | null;
  locked_by?: string;
}

// สำหรับ SeatRow
export interface SeatRowData {
  row: string;
  seats: Seat[];
}

export interface BookingInfo {
  id: string;
  date: string;
  price: number;
  seats: SeatRowData[];
  hall: {
    id: string;
    name: string;
    cinema: {
      id: string;
      name: string;
    };
  };
  movie: {
    id: string;
    title: string;
    poster_url?: string;
    rating?: string;
    genre?: string;
    duration_min: number;
  };
  time_slot?: {
    start_time: string;
    end_time: string;
  };
}
