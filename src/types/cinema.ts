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
