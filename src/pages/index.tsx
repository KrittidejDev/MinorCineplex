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

const CurtainIntro = dynamic(
  () => import("@/components/Widgets/CurtainIntro"),
  { ssr: false }
);

export default function Home() {
  const [filter, setFilter] = useState<string>("1");
  const [dataCinemas, setDataCinemas] = useState<any[]>([]);
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

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoadingMovies(true);
        const res = await axios.get<{ movie: APIMovie[] }>("/api/movies");
        setMovies(res.data.movie);
      } catch (err) {
        console.error("Failed to fetch movies", err);
        setMovies([]);
      } finally {
        setLoadingMovies(false);
      }
    };
    fetchMovies();
  }, []);

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
      console.log("Searching movies with filters:", filters);

      const params: any = {};
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
        <div className="mt-20">
          <NowShowingComingSoon
            movies={movies}
            loading={loadingMovies}
            showAll={movies.length > 0 && searchActive}
          />
        </div>
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
