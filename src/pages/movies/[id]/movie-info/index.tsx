import NavAndFooterWithBanner from "@/components/MainLayout/NavAndFooterWithBanner";
import FilterSearch from "@/components/Widgets/FilterSearch";
import MovieInfoWidget from "@/components/Widgets/MovieInfoWidget";
import CinemaLocation from "@/components/Widgets/CinemaLocation";
import { useLocationPermission } from "@/lib/hooks/useLocationPermission";
import LocationPermissionModal from "@/components/Modals/LocationPermissionModal";
import { useNearbyCinemas } from "@/lib/hooks/useNearbyCinemas";
import { useState, useEffect } from "react";

function MovieInfo() {
  const [filter, setFilter] = useState<string>("1");
  const [dataCinemas, setDataCinemas] = useState<any[]>([]);
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

  return (
    <>
      <NavAndFooterWithBanner>
        <div className=" max-w-[1200px] mx-auto">
          <FilterSearch />
          <div className="mt-10">
            <MovieInfoWidget />
          </div>
        </div>

        <CinemaLocation data={dataCinemas} filterCinema={handleFilter} />

        <LocationPermissionModal
          isOpen={showModal}
          onAllowSession={allowSession}
          onAllowOnce={allowOnce}
          onNeverAllow={neverAllow}
          onClose={closeModal}
        />
      </NavAndFooterWithBanner>
    </>
  );
}

export default MovieInfo;
