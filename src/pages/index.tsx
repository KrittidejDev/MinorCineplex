import React, { useEffect, useState } from "react";
import NavAndFooterWithBanner from "@/components/MainLayout/NavAndFooterWithBanner";
import NowShowingComingSoon from "@/components/Widgets/NowShowingComingSoonWidget";
import CinemaLocation from "@/components/Widgets/CinemaLocation";
import Coupon from "@/components/Widgets/CouponCardWidget";
import LocationPermissionModal from "@/components/Modals/LocationPermissionModal";
import { useLocationPermission } from "@/lib/hooks/useLocationPermission";
import { useNearbyCinemas } from "@/lib/hooks/useNearbyCinemas";
import dynamic from "next/dynamic";
import FilterSearch, { FilterData } from "@/components/Widgets/FilterSearch";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { MovieAPIRespons, MovieDTO } from "@/types/movie";
import { MovieStatus } from "@/types/enums";
import { CinemaByProvince } from "@/types/cinema";

const CurtainIntro = dynamic(
  () => import("@/components/Widgets/CurtainIntro"),
  { ssr: false }
);

export default function Home() {
  const [filter, setFilter] = useState<string>("1");
  const [query, setQuery] = useState<FilterData>({
    title: "",
    genre: "",
    language: "",
    release_date: "",
    status: MovieStatus.NOW_SHOWING,
  });
  const [dataCinemas, setDataCinemas] = useState<CinemaByProvince[]>([]);
  const [showCurtain, setShowCurtain] = useState(false);
  const [movies, setMovies] = useState<MovieDTO[]>([]);
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
    loading: locationLoading,
  } = useLocationPermission();

  const { cinemas, refetch } = useNearbyCinemas(location, filter);
  const searchParams = useSearchParams();

  const fetchAllMovies = async (filters?: FilterData) => {
    try {
      setLoadingMovies(true);
      setSearchActive(
        !!filters && Object.values(filters).some((v) => v !== "")
      );
      const searchParamsObj = new URLSearchParams();
      if (filters) {
        if (filters.title && filters.title !== "all-movies")
          searchParamsObj.append("title", filters.title);
        if (
          filters.genre &&
          filters.genre.length > 0 &&
          !filters.genre.includes("all-genres")
        ) {
          searchParamsObj.append("genre", filters.genre);
        }
        if (filters.language && filters.language !== "all-languages")
          searchParamsObj.append("language", filters.language);
        if (filters.release_date)
          searchParamsObj.append("release_date", filters.release_date);
        if (filters.status) searchParamsObj.append("status", filters.status);
      }
      const queryString = searchParamsObj.toString();
      const url = queryString ? `/api/movies?${queryString}` : "/api/movies";
      const res = await axios.get<MovieAPIRespons>(url);
      setMovies(res.data.data);
    } catch (err) {
      console.error("Failed to fetch movies", err);
      setMovies([]);
    } finally {
      setLoadingMovies(false);
    }
  };

  useEffect(() => {
  const filters: FilterData = {
    title: searchParams.get("title") || "",
    genre: searchParams.get("genre") || "",
    language: searchParams.get("language") || "",
    release_date: searchParams.get("release_date") || "",
    status: (searchParams.get("status") as MovieStatus) || MovieStatus.NOW_SHOWING,
  };

  const hasFilters = Object.values(filters).some((v) => v !== "");
  setQuery(filters);
  fetchAllMovies(hasFilters ? filters : undefined);
}, [searchParams]);

  useEffect(() => {
    const lastShown = localStorage.getItem("curtain_last_shown");
    const now = Date.now();
    const fiveMinutes = 1000 * 60 * 5;
    if (!lastShown || now - parseInt(lastShown, 10) > fiveMinutes) {
      setShowCurtain(true);
      localStorage.setItem("curtain_last_shown", now.toString());
    }
  }, []);

  useEffect(() => {
    if (!location && !locationLoading && !showModal) {
      openModal();
    }
  }, [location, locationLoading, showModal, openModal]);

  useEffect(() => {
    setDataCinemas(cinemas);
  }, [cinemas]);

  const handleFilter = (value: string) => {
    setFilter(value);
    if (value === "2" && !location) {
      openModal();
      return;
    }
    refetch(value);
  };

  const handleTabClick = (tab: MovieStatus) => {
    const newQuery: FilterData = { ...query, status: tab };
    setQuery(newQuery);
    fetchAllMovies(newQuery);
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
          <FilterSearch
            onSearch={(filters) => fetchAllMovies(filters)}
            query={query}
            movies={movies}
            setQuery={setQuery}
          />
        </div>
        <NowShowingComingSoon
          movies={movies}
          loading={loadingMovies}
          query={query}
          onTabClick={handleTabClick}
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
