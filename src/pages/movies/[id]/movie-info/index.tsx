import NavAndFooterWithBanner from "@/components/MainLayout/NavAndFooterWithBanner";
import MovieInfoWidget from "@/components/Widgets/MovieInfoWidget";
import CinemaLocation from "@/components/Widgets/CinemaLocation";
import { useLocationPermission } from "@/lib/hooks/useLocationPermission";
import LocationPermissionModal from "@/components/Modals/LocationPermissionModal";
import { useNearbyCinemas } from "@/lib/hooks/useNearbyCinemas";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { APIMovie } from "@/types/movie";
import { CinemaByProvince } from "@/components/Widgets/CinemaLocation";

type TimeSlot = {
  id: string;
  start_time: string;
  end_time: string;
};

type Showtime = {
  id: string;
  date: string;
  price: number;
  movie: APIMovie;
  time_slot: TimeSlot;
};

type Hall = {
  id: string;
  name: string;
  showtimes: Showtime[];
};

type Cinema = {
  id: string;
  name: string;
  name_en: string;
  halls: Hall[];
};

function MovieInfo() {
  const params = useParams();
  const movieId = params?.id;
  const [movie, setMovie] = useState<APIMovie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("1");
  const [dataCinemas, setDataCinemas] = useState<CinemaByProvince[]>([]);
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
  const [data, setData] = useState<Cinema[]>([]);

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

  const getCinemasByMovies = async (movieId: string, date?: Date) => {
    if (!movieId) return;
    try {
      const dateQuery = date ? `&date=${date.toISOString().split("T")[0]}` : "";
      const res = await axios.get(
        `/api/cinemas?movie_id=${movieId}${dateQuery}`
      );
      setData(res.data.cinema);
    } catch (error: unknown) {
      if (error instanceof Error) console.log("Error:", error.message);
    }
  };

  useEffect(() => {
    if (movieId) getCinemasByMovies(movieId as string);
  }, [movieId]);


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
        <div>
          <div className="w-dvw flex justify-center relative mx-auto -mt-10">
          </div>

          <div>
            <MovieInfoWidget movie={movie}/>
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
