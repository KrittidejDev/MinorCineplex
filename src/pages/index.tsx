import React, { useEffect, useState } from "react";
import NavAndFooterWithBanner from "@/components/MainLayout/NavAndFooterWithBanner";
import NowShowingComingSoon from "@/components/Widgets/NowShowingComingSoonWidget";
import CinemaLocation from "@/components/Widgets/CinemaLocation";
import Coupon from "@/components/Widgets/CouponCardWidget";
import LocationPermissionModal from "@/components/Modals/LocationPermissionModal";
import { useLocationPermission } from "@/lib/hooks/useLocationPermission";
import { useNearbyCinemas } from "@/lib/hooks/useNearbyCinemas";
import dynamic from "next/dynamic";
import FilterSearch from "@/components/Widgets/FilterSearch";
import axios from "axios";
import { APIMovie } from "@/types/movie";
import { useSearchParams } from "next/navigation";
import { CinemaByProvince } from "@/components/Widgets/CinemaLocation";


const CurtainIntro = dynamic(
  () => import("@/components/Widgets/CurtainIntro"),
  { ssr: false }
);

export default function Home() {
  const [filter, setFilter] = useState<string>("1");
  const [dataCinemas, setDataCinemas] = useState<CinemaByProvince[]>([]);
  const [showCurtain, setShowCurtain] = useState(false);
  const [movies, setMovies] = useState<APIMovie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const {
    location,
    showModal,
    openModal,
    closeModal,
    allowSession,
    allowOnce,
    neverAllow,
  } = useLocationPermission();

  const { cinemas, loading, refetch } = useNearbyCinemas(location, filter);
  const searchParams = useSearchParams();

  useEffect(() => {
    const filters = {
      title: searchParams.get("title") || "",
      genre: searchParams.get("genre") || "",
      language: searchParams.get("language") || "",
      releaseDate: searchParams.get("releaseDate") || "",
    };

    const hasFilters = Object.values(filters).some((v) => v !== "");
    if (hasFilters) {
      handleSearchMovies(filters);
    } else {
      fetchAllMovies();
    }
  }, [searchParams]);

  const fetchAllMovies = async () => {
    try {
      setLoadingMovies(true);
      setSearchActive(false);
      const res = await axios.get<{ movie: APIMovie[] }>("/api/movies");
      setMovies(res.data.movie);
    } catch (err) {
      console.error("Failed to fetch movies", err);
      setMovies([]);
    } finally {
      setLoadingMovies(false);
    }
  };

  useEffect(() => {
    const lastShown = localStorage.getItem("curtain_last_shown");
    const now = Date.now();
    const fiveMinutes = 1000 * 60 * 5;
    if (!lastShown || now - parseInt(lastShown, 5) > fiveMinutes) {
      setShowCurtain(true);
      localStorage.setItem("curtain_last_shown", now.toString());
    }
  }, []);

  useEffect(() => {
    setDataCinemas(cinemas);
  }, [cinemas]);

  const handleSearchMovies = async (filters: {
    title?: string;
    genre?: string;
    language?: string;
    releaseDate?: string;
    id?: string;
  }) => {
    try {
      setLoadingMovies(true);
      setSearchActive(true);

      const params: Record<string, string> = {};
      if (filters.title) {
        params.title = filters.title;
      }
      if (filters.genre) params.genre = filters.genre;
      if (filters.language) params.language = filters.language;
      if (filters.releaseDate) params.releaseDate = filters.releaseDate;

      const res = await axios.get<{ movie: APIMovie[] }>("/api/movies", {
        params,
      });
      setMovies(res.data.movie);
    } catch (err) {
      console.error("Failed to fetch movies with filters", err);
      setMovies([]);
    } finally {
      setLoadingMovies(false);
    }
  };

  const handleFilter = (value: string) => {
    setFilter(value);
    if (value === "2" && !location) {
      openModal();
      return;
    }
    refetch(value);
  };

  return (
    <NavAndFooterWithBanner>
      {showCurtain && (
        <CurtainIntro
          durationMs={2000}
          showLogo={true}
          onComplete={() => setShowCurtain(false)}
        />
      )}
      <div className="flex-1 max-w-[1200px]">
        <div className="w-dvw flex justify-center relative mx-auto -mt-10">
          <FilterSearch onSearch={handleSearchMovies} />
        </div>
        <NowShowingComingSoon
          movies={movies}
          loading={loadingMovies}
          showAll={movies.length > 0 && searchActive}
        />
        <Coupon />
        <CinemaLocation data={dataCinemas} filterCinema={handleFilter} />
      </div>
      <LocationPermissionModal
        isOpen={showModal}
        onAllowSession={allowSession}
        onAllowOnce={allowOnce}
        onNeverAllow={neverAllow}
        onClose={closeModal}
      />
    </NavAndFooterWithBanner>
  );
}
