import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import MovieInfoWidget from "@/components/Widgets/MovieInfoWidget";
import CinemaLocation from "@/components/Widgets/CinemaLocation";
import { useLocationPermission } from "@/lib/hooks/useLocationPermission";
import LocationPermissionModal from "@/components/Modals/LocationPermissionModal";
import { useNearbyCinemas } from "@/lib/hooks/useNearbyCinemas";
import { MovieDTO, ShowtimeDTO } from "@/types/movie";
import { format } from "date-fns";
import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

function MovieInfo() {
  const { t } = useTranslation("common");
  const params = useParams();
  const movieSlug = params?.slug as string;
  const [movie, setMovie] = useState<MovieDTO | null>(null);
  const [showtimes, setShowtimes] = useState<ShowtimeDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("1");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [movieLoading, setMovieLoading] = useState(true);
  const [showtimesLoading, setShowtimesLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchCity, setSearchCity] = useState("");
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
        setError(t("cannot_load_movie") || "ไม่สามารถโหลดข้อมูลหนังได้");
      } finally {
        fetchShowtimes(selectedDate);
        setMovieLoading(false);
      }
    };

    fetchMovie();
  }, [movieSlug, t]);

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
        params: { date: dateQuery, search: searchValue, city: searchCity },
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

  useEffect(() => {
    fetchShowtimes(selectedDate);
  }, [searchValue, searchCity]);

  if (movieLoading) return <p>{t("loading") || "Loading..."}</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return <p>{t("movie_not_found") || "ไม่พบข้อมูลหนัง"}</p>;

  return (
    <NavAndFooter>
      <Image
        src="/images/cover-cinema.png"
        alt={t("cinema_interior") || "Cinema Interior"}
        fill
        className="hidden md:flex object-cover object-center w-full z-0! max-h-[100vh] overflow-hidden "
      />
      <MovieInfoWidget
        movie={movie}
        showtimes={showtimes}
        selectedDate={selectedDate}
        onSelectDate={onSelectedDate}
        showtimesLoading={showtimesLoading}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        searchCity={searchCity}
        setSearchCity={setSearchCity}
      />
      <CinemaLocation data={cinemas} filterCinema={handleFilter} />
      <LocationPermissionModal
        isOpen={showModal}
        onAllowSession={allowSession}
        onAllowOnce={allowOnce}
        onNeverAllow={neverAllow}
        onClose={closeModal}
      />
    </NavAndFooter>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default MovieInfo;
