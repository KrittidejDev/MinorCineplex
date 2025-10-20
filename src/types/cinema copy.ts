export interface CinemaDTO {
  id: string;
  slug: string;
  name: string;
  translations?: Record<string, string> | null; // เปลี่ยนจาก any เป็น string
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

// ---------------- CinemaType (เดิม import) ----------------
export interface CinemaType {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  // ลบ [key: string]: any เพื่อให้ type-safe
  // หากต้องการ properties เพิ่มเติม สามารถเพิ่ม field เฉพาะ เช่น:
  // [key: string]: string | number | null; // ถ้าต้องการความยืดหยุ่น
}

// ---------------- CinemaWithDistance ----------------
export interface CinemaWithDistance extends CinemaType {
  distance: number | null;
  distance_text?: string; // "12.3 km"
  distance_text_th?: string; // "12.3 กม."
  provinceTh?: string;
  provinceEn?: string;
}

// ---------------- CinemaByProvince ----------------
export interface CinemaByProvince {
  provinceTh?: string;
  provinceEn?: string;
  cinemas: CinemaWithDistance[];
}

// ---------------- Return type ของ hook ----------------
export interface UseNearbyCinemasReturn {
  cinemas: CinemaByProvince[];
  loading: boolean;
  error: string | null;
  refetch: (filter?: string) => void;
}

// ===============

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
  address: string;
  lat: number | null;
  lng: number | null;
}

export interface CinemaWithDistance extends CinemaType {
  distance: number | null;
  distance_text?: string;
  distance_text_th?: string;
  provinceTh?: string;
  provinceEn?: string;
}

export interface CinemaByProvince {
  provinceTh?: string;
  provinceEn?: string;
  cinemas: CinemaWithDistance[];
}

export interface UseNearbyCinemasReturn {
  cinemas: CinemaByProvince[];
  loading: boolean;
  error: string | null;
  refetch: (filter?: string) => void;
}

// เพิ่ม interface สำหรับ SelectedSeat
export interface SelectedSeat {
  id: string;
  seat_number: string;
  price: number;
  row: string;
}

// เพิ่ม interface สำหรับ BillInfo
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

export interface SelectedSeat {
  id: string;
  seat_number: string;
  price: number;
  row: string;
}
