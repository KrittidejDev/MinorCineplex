import axios from "axios";
import { useEffect, useState } from "react";

export interface Cinema {
  id: string;
  name: string;
  name_en?: string | null;
  address: string;
  lat: number | null;
  lng: number | null;
  icon_url?: string | null;
}

interface UseNearbyCinemasReturn {
  cinemas: (Cinema & { distance?: number })[];
  loading: boolean;
  error: string | null;
}

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
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useNearbyCinemas = (
  userLocation: { lat: number; lng: number } | null
): UseNearbyCinemasReturn => {
  const [cinemas, setCinemas] = useState<(Cinema & { distance?: number })[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Cinema[]>("/api/cinemas");
        const data = res.data;
        setCinemas(data);
      } catch (err: any) {
        setError(err.message || "Failed to load cinemas");
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const fetchAndSort = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Cinema[]>("/api/cinemas");
        const data = res.data;

        const withDistance = data
          .filter((c) => c.lat !== null && c.lng !== null)
          .map((cinema) => ({
            ...cinema,
            distance: haversineDistance(
              userLocation.lat,
              userLocation.lng,
              cinema.lat!,
              cinema.lng!
            ),
          }))
          .sort((a, b) => a.distance! - b.distance!);

        setCinemas(withDistance);
      } catch (err: any) {
        setError(err.message || "Failed to load cinemas");
      } finally {
        setLoading(false);
      }
    };

    fetchAndSort();
  }, [userLocation]);

  return { cinemas, loading, error };
};
