import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import NavAndFooterWithBanner from "@/components/MainLayout/NavAndFooterWithBanner";
import MovieInfoWidget from "@/components/Widgets/MovieInfoWidget";
import CinemaLocation from "@/components/Widgets/CinemaLocation";
import { useLocationPermission } from "@/lib/hooks/useLocationPermission";
import LocationPermissionModal from "@/components/Modals/LocationPermissionModal";
import { useNearbyCinemas } from "@/lib/hooks/useNearbyCinemas";
import { MovieDTO, ShowtimeDTO } from "@/types/movie";
import { format } from "date-fns";

function MovieInfo() {
  const params = useParams();
  const movieSlug = params?.slug as string;
  const [movie, setMovie] = useState<MovieDTO | null>(null);
  const [showtimes, setShowtimes] = useState<ShowtimeDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("1");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [movieLoading, setMovieLoading] = useState(true);
  const [showtimesLoading, setShowtimesLoading] = useState(true);
  const {
    location,
    showModal,
    openModal,
    closeModal,
    allowSession,
    allowOnce,
    neverAllow,
  } = useLocationPermission();
  const { cinemas, refetch } = useNearbyCinemas(location, filter);

  useEffect(() => {
    if (!movieSlug) return;

    const fetchMovie = async () => {
      setMovieLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/movies/${movieSlug}`);
        setMovie(res.data);
      } catch (err) {
        console.error("Error fetching movie:", err);
        setError("ไม่สามารถโหลดข้อมูลหนังได้");
      } finally {
        fetchShowtimes(selectedDate);
        setMovieLoading(false);
      }
    };

    fetchMovie();
  }, [movieSlug]);

  const handleFilter = (value: string) => {
    setFilter(value);
    if (value === "2" && !location) {
      openModal();
      return;
    }
    refetch(value);
  };

  const fetchShowtimes = async (date: Date) => {
    setShowtimesLoading(true);
    try {
      const dateQuery = format(date, "yyyy-MM-dd");
      const res = await axios.get(`/api/movies/${movieSlug}/showtimes`, {
        params: { date: dateQuery },
      });
      setShowtimes(res.data);
    } catch (err) {
      console.error("Error fetching showtimes:", err);
      setShowtimes([]);
    } finally {
      setShowtimesLoading(false);
    }
  };

  const onSelectedDate = (e: Date) => {
    fetchShowtimes(e);
    setSelectedDate(e);
  };

  if (movieLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return <p>ไม่พบข้อมูลหนัง</p>;

  return (
    <NavAndFooterWithBanner>
      <div>
        <div className="w-dvw flex justify-center relative mx-auto mt-10"></div>
        <div>
          <MovieInfoWidget
            movie={movie}
            showtimes={showtimes}
            selectedDate={selectedDate}
            onSelectDate={(e) => onSelectedDate(e)}
            showtimesLoading={showtimesLoading}
          />
        </div>
      </div>
      <CinemaLocation data={cinemas} filterCinema={handleFilter} />
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

export default MovieInfo;
