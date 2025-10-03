import NavAndFooterWithBanner from "@/components/MainLayout/NavAndFooterWithBanner";
import FilterSearch from "@/components/Widgets/FilterSearch";
import MovieInfoWidget from "@/components/Widgets/MovieInfoWidget";
import CinemaLocation from "@/components/Widgets/CinemaLocation";
import { useLocationPermission } from "@/lib/hooks/useLocationPermission";
import LocationPermissionModal from "@/components/Modals/LocationPermissionModal";
import { useNearbyCinemas } from "@/lib/hooks/useNearbyCinemas";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { APIMovie } from "@/types/movie";

function MovieInfo() {
  const params = useParams();
  const movieId = params?.id;
  const [movie, setMovie] = useState<APIMovie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("1");
  const [dataCinemas, setDataCinemas] = useState<any[]>([]);
  const [movieloading, setMovieLoading] = useState(true);
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
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        const res = await axios.get(`/api/movies/${movieId}`);
        setMovie(res.data.movie);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลหนังได้");
      } finally {
        setMovieLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return <p>ไม่พบข้อมูลหนัง</p>;

  return (
    <>
      <NavAndFooterWithBanner>
        <div className="max-w-[1200px]">
          <div className="w-screen flex justify-center relative mx-auto -mt-10">
            <FilterSearch />
          </div>
          <div className="mt-10">
            <MovieInfoWidget movie={movie} />
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
