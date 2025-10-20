import { MovieStatus } from "@/generated/prisma";

export interface MovieDTO {
  id: string;
  slug: string;
  title: string;
  translations?: {
    th?: { title: string; description: string };
    en?: { title: string; description: string };
  };
  duration_min: number;
  poster_url?: string;
  trailer_url?: string;
  rating?: string;
  release_date?: Date;
  status: string;
  actors: { actor: { id: string; name: string } }[];
  directors: { director: { id: string; name: string } }[];
  genres: (
    | {
        genre: {
          id: string;
          name: string;
          slug: string;
          translations?: { en?: { name: string }; th?: { name: string } };
        };
      }
    | { language: { id: string; name: string; code: string } }
  )[];
  languages: { language: { id: string; name: string; code: string } }[];
}

export interface MovieFilters {
  title?: string;
  language?: string;
  genre?: string;
  release_date?: string;
  status?: "NOW_SHOWING" | "COMING_SOON";
}

export interface Pagination {
  page?: number;
  limit?: number;
}

export interface MovieAPIRespons {
  success: boolean;
  message?: string;
  data: MovieDTO[];
}

export interface ShowtimeDTO {
  cinema: {
    id: string;
    slug: string;
    name: string;
    name_en?: string;
    address: string;
    city?: string;
  };
  halls: {
    hall: {
      id: string;
      slug: string;
      name: string;
      seat_count: number;
    };
    showtimes: {
      id: string;
      date: Date;
      price: number;
      available_seats: number;
      total_seats: number;
      time_slot: {
        id: string;
        name: string;
        start_time: string;
        end_time: string;
      };
    }[];
  }[];
}
