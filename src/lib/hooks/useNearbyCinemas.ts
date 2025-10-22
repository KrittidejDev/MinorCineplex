import {
  CinemaWithDistance,
  CinemaByProvince,
  CinemaDTO,
} from "@/types/cinema";
import { useEffect, useState, useCallback } from "react";
import { userService } from "@/config/userServices";
import { getProvinceName } from "@/lib/utils/province";

interface UseNearbyCinemasReturn {
  cinemas: CinemaByProvince[];
  loading: boolean;
  error: string | null;
  refetch: (filter?: string) => void;
}

// Haversine formula
const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Group cinemas by province
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

  const fetchCinemas = useCallback(
    async (filterVal: string = filter) => {
      try {
        setLoading(true);

        const res = (await userService.GET_CINEMAS()) as {
          count: number;
          data: CinemaDTO[];
        };
        const data: CinemaDTO[] = res.data;

        const cinemasWithDistance: CinemaWithDistance[] = data.map((c) => {
          let distance: number | null = null;

          if (
            userLocation &&
            c.lat !== null &&
            c.lng !== null &&
            typeof c.lat === "number" &&
            typeof c.lng === "number"
          ) {
            distance = Math.round(
              haversineDistance(
                userLocation.lat,
                userLocation.lng,
                c.lat,
                c.lng
              )
            );
          }

          const province = getProvinceName(c.address || "");
          const distanceFixed =
            distance !== null ? Number(distance.toFixed(1)) : null;

          return {
            ...c,
            slug: c.slug,
            address: c.address ?? "",
            distance,
            distance_text:
              distance !== null ? `${distanceFixed} km` : undefined,
            distance_text_th:
              distance !== null ? `${distanceFixed} กม.` : undefined,
            provinceTh: province.th,
            provinceEn: province.en,
          };
        });

        if (filterVal === "2") {
          if (!userLocation) {
            setCinemas([]);
            return;
          }

          // ใกล้ที่สุด 10 โรง
          const nearest = cinemasWithDistance
            .filter((c) => c.distance !== null)
            .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
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
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("ไม่สามารถโหลดข้อมูลโรงหนังได้");
      } finally {
        setLoading(false);
      }
    },
    [filter, userLocation]
  );

  useEffect(() => {
    fetchCinemas(filter);
  }, [fetchCinemas, filter]);

  return { cinemas, loading, error, refetch: fetchCinemas };
};
