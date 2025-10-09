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
}

export interface MovieCardData {
  id: string;
  title: string;
  poster_url?: string | null;
  release_date?: Date | null;
  rating?: string | null;
  genre?: string | null;
}
