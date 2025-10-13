import { CinemaType } from "@/types/cinema";
import { useEffect, useState } from "react";
import { userService } from "@/config/userServices";
import { getProvinceName } from "@/lib/utils/province";

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

interface UseNearbyCinemasReturn {
  cinemas: CinemaByProvince[];
  loading: boolean;
  error: string | null;
  refetch: (filter?: string) => void;
}

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const groupByProvince = (cinemas: CinemaWithDistance[]): CinemaByProvince[] => {
  const map: Record<string, CinemaWithDistance[]> = {};

  cinemas.forEach((cinema) => {
    let province = cinema.provinceTh || "Other";

    if (province === "กรุงเทพ" || province === "กรุงเทพมหานคร") {
      province = "กรุงเทพมหานคร";
      cinema.provinceEn = "Bangkok";
    }

    if (!map[province]) map[province] = [];
    map[province].push(cinema);
  });

  return Object.entries(map).map(([provinceTh, cinemas]) => ({
    provinceTh,
    provinceEn: cinemas[0]?.provinceEn || "Other",
    cinemas,
  }));
};

export const useNearbyCinemas = (
  userLocation: { lat: number; lng: number } | null,
  filter: string = "1"
): UseNearbyCinemasReturn => {
  const [cinemas, setCinemas] = useState<CinemaByProvince[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCinemas = async (filterVal: string = filter) => {
    try {
      setLoading(true);

      const res = (await userService.GET_CINEMAS()) as { cinema: CinemaType[] };
      const data: CinemaType[] = res.cinema;

      const cinemasWithDistance: CinemaWithDistance[] = data.map((c) => {
        let distance: number | null = null;
        if (userLocation && c.lat !== null && c.lng !== null) {
          distance = Math.round(
            haversineDistance(userLocation.lat, userLocation.lng, c.lat, c.lng)
          );
        }

        const province = getProvinceName(c.address);

        return {
          ...c,
          distance,
          distance_text: distance !== null ? `${distance} km` : undefined,
          distance_text_th: distance !== null ? `${distance} กม.` : undefined,
          provinceTh: province.th,
          provinceEn: province.en,
        };
      });

      if (filterVal === "2") {
        if (!userLocation) {
          setCinemas([]);
          return;
        }
        const nearest = cinemasWithDistance
          .filter((c) => c.distance !== null)
          .sort((a, b) => a.distance! - b.distance!)
          .slice(0, 10);

        setCinemas([
          {
            provinceTh: "ใกล้ฉัน",
            provinceEn: "Nearest Cinemas",
            cinemas: nearest,
          },
        ]);
      } else {
        const grouped = groupByProvince(cinemasWithDistance);
        setCinemas(grouped);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load cinemas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas(filter);
  }, [userLocation]);

  return { cinemas, loading, error, refetch: fetchCinemas };
};
