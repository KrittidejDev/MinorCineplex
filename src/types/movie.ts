export interface Actor {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export interface Director {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export interface APIMovie {
  id: string;
  title: string;
  duration_min: number;
  description?: string | null;
  poster_url?: string | null;
  trailer_url?: string | null;
  genre?: string | null;
  rating?: string | null;
  created_at: Date;
  updated_at: Date;
  release_date?: Date | null;
  actors?: Actor[];
  directors?: Director[];
  showtimes?: string[];
}

export interface MovieCardData {
  id: string;
  title: string;
  poster_url?: string | null;
  release_date?: Date | null;
  rating?: string | null;
  genre?: string | null;
}

export interface MovieWithHalls {
  id: string;
  title: string;
  duration_min: number;
  poster_url?: string;
  description?: string;
  genre?: string;
  rating?: string;
  halls: HallWithTimeslots[];
}

export interface HallWithTimeslots {
  id: string;
  name: string;
  seat_count?: number;
  timeslots: TimeslotData[];
}

export interface TimeslotData {
  showtime_id: string;
  name: string;
  price: number;
  date: string;
  seats: ShowtimeSeatData[];
}

export interface ShowtimeSeatData {
  id: string;
  seat_id: string;
  showtime_id: string;
  status: string;
  price: number;
}
