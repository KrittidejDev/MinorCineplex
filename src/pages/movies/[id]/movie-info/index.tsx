import NavAndFooterWithBanner from "@/components/MainLayout/NavAndFooterWithBanner";
import FilterSearch from "@/components/Widgets/FilterSearch";
import MovieInfoWidget from "@/components/Widgets/MovieInfoWidget";
import CinemaLocation from "@/components/Widgets/CinemaLocation";
import { useLocationPermission } from "@/lib/hooks/useLocationPermission";
import LocationPermissionModal from "@/components/Modals/LocationPermissionModal";
import { useNearbyCinemas } from "@/lib/hooks/useNearbyCinemas";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { APIMovie } from "@/types/movie";
import ShowTime from "@/components/Widgets/ShowTime";

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
  const router = useRouter();
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
  const [data, setData] = useState<Cinema[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
  if (movieId) getCinemasByMovies(movieId as string, selectedDate);
}, [movieId, selectedDate]);

const handleSelectShowtime = (showtimeId: string) => {
    router.push(
      `/movies/${movieId}/movie-booking/seat?showtime=${showtimeId}`
    );
  };

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

          <div className="flex justify-center relative lg:-mt-10">
            <FilterSearch />
          </div>

          <div className="mt-10">
            <MovieInfoWidget movie={movie} />
          </div>
        </div>

        <div className="w-full max-w-[1200px] mx-auto my-10">
                <div className="flex flex-col items-center gap-6 md:px-4">
                  {data.map((cinema: Cinema) => {
                    const groups = cinema.halls
                      .map((hall) => ({
                        hallId: hall.id,
                        hallLabel: hall.name,
                        times: hall.showtimes
                          .filter(
                            (showtime) =>
                              new Date(showtime.date).toDateString() ===
                              selectedDate.toDateString()
                          )
                          .map((showtime) => ({
                            id: showtime.id,
                            label: showtime.time_slot.start_time,
                            disabled: false,
                          })),
                      }))
                      .filter((group) => group.times.length > 0);
        
                    if (groups.length === 0) return null;
        
                    return (
                      <div
                        key={cinema.id}
                        className="w-full md:rounded-md bg-gray-gc1b p-4"
                      >
                        <ShowTime
                          groups={groups}
                          cinemaName={cinema.name_en}
                          badges={["Hearing assistance", "Wheelchair access"]}
                          onChange={(time) => {
                            if (time) handleSelectShowtime(time.id);
                          }}
                        />
                      </div>
                    );
                  })}
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
