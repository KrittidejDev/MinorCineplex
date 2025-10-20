import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../Cards/MovieCard";
import { MovieAPIRespons, MovieDTO } from "@/types/movie";
import { useRouter } from "next/router";

function AllMoviesWidget() {
  const [activeTab, setActiveTab] = useState("NOW_SHOWING");
  const [movies, setMovies] = useState<MovieDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchAllMovies = async () => {
    try {
      setLoading(true);
      const url = activeTab ? `/api/movies?status=${activeTab}` : "/api/movies";
      const res = await axios.get<MovieAPIRespons>(url);
      setMovies(res.data.data);
    } catch (err) {
      console.error("Failed to fetch movies", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMovies();
  }, [activeTab]);

  const groupedMovies =
    activeTab === "COMING_SOON"
      ? movies.reduce((groups: Record<string, MovieDTO[]>, movie) => {
          if (!movie.release_date) return groups;
          const date = new Date(movie.release_date);
          const monthYear = date.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          });

          if (!groups[monthYear]) groups[monthYear] = [];
          groups[monthYear].push(movie);
          return groups;
        }, {})
      : null;

  const sortedMonthKeys =
    groupedMovies &&
    Object.keys(groupedMovies).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <div className="w-screen">
      <div className="w-screen bg-gray-gc1b py-10">
        <div className="flex justify-center gap-6">
          <button
            onClick={() => setActiveTab("NOW_SHOWING")}
            className={`font-bold text-f-24 py-1 cursor-pointer ${
              activeTab === "NOW_SHOWING"
                ? "text-white-wfff border-b-2 border-gray-gf7e"
                : "text-gray-g3b0 border-b-2 border-transparent"
            }`}
          >
            Now showing
          </button>
          <button
            onClick={() => setActiveTab("COMING_SOON")}
            className={`font-bold text-f-24 py-1 cursor-pointer ${
              activeTab === "COMING_SOON"
                ? "text-white-wfff border-b-2 border-gray-gf7e"
                : "text-gray-g3b0 border-b-2 border-transparent"
            }`}
          >
            Coming soon
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-20 text-white">
          กำลังโหลด...
        </div>
      ) : (
        <div className="flex flex-col justify-center py-20 px-4">
          {activeTab === "COMING_SOON" && groupedMovies ? (
            sortedMonthKeys?.map((monthYear) => (
              <div
                key={monthYear}
                className="max-w-[1200px] w-full mx-auto mb-10"
              >
                <h2 className="text-f-24 mb-10">{monthYear}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {groupedMovies[monthYear].map((movie) => (
                    <div
                      key={movie.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/movies/${movie.slug}`)}
                    >
                      <MovieCard
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        poster_url={movie.poster_url}
                        release_date={movie.release_date ?? undefined}
                        rating={movie.rating}
                        genres={[...movie.genres, ...movie.languages]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-[1200px] w-full">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/movies/${movie.slug}`)}
                  >
                    <MovieCard
                      key={movie.id}
                      id={movie.id}
                      title={movie.title}
                      poster_url={movie.poster_url}
                      release_date={movie.release_date ?? undefined}
                      rating={movie.rating}
                      genres={[...movie.genres, ...movie.languages]}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AllMoviesWidget;
