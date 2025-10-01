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

// Interface สำหรับ showtime ของแต่ละวัน
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
    start_time: string; // เปลี่ยนเป็น string
    end_time: string; // เปลี่ยนเป็น string
  };
  date: string; // เปลี่ยนเป็น string (YYYY-MM-DD)
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

// Interface สำหรับ cinema
export interface CinemaDetail {
  id: string;
  name: string;
  address: string;
  phone?: string;
  description?: string;
  icon_url?: string;
  halls: HallDetail[];
  showtimesByDay: {
    date: string; // YYYY-MM-DD
    halls: HallDetail[];
  }[];
}
