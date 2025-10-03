import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import MovieCard from "../Cards/MovieCard";
import { APIMovie, MovieCardData } from "@/types/movie";
import { useRouter } from "next/router";

function AllMoviesWidget() {
  const [activeTab, setActiveTab] = useState("nowShowing");
  const [movies, setMovies] = useState<MovieCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get<{ movie: APIMovie[] }>("/api/movies");

        console.log("Raw movies from API:", res.data.movie);

        const Movies: MovieCardData[] = res.data.movie.map((movie) => ({
          id: movie.id,
          title: movie.title,
          poster_url: movie.poster_url,
          release_date: movie.release_date
            ? new Date(movie.release_date)
            : null,
          rating: movie.rating,
          genre: movie.genre,
        }));
        setMovies(Movies);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดหนังได้");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const today = new Date();
  const nowShowingMovies = movies.filter(
    (m) => m.release_date && m.release_date <= today
  );

  const comingSoonMovies = movies.filter(
    (m) => m.release_date && m.release_date > today
  );

  const moviesToDisplay =
    activeTab === "nowShowing" ? nowShowingMovies : comingSoonMovies;

  return (
    <>
      <div className="w-screen">
        <div className="w-screen bg-gray-gc1b py-10">
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setActiveTab("nowShowing")}
              className={`font-bold text-f-24 py-1 cursor-pointer ${
                activeTab === "nowShowing"
                  ? "text-white-wfff border-b-2 border-gray-gf7e"
                  : "text-gray-g3b0 border-b-2 border-transparent"
              }`}
            >
              Now showing
            </button>
            <button
              onClick={() => setActiveTab("comingSoon")}
              className={`font-bold text-f-24 py-1 cursor-pointer ${
                activeTab === "comingSoon"
                  ? "text-white-wfff border-b-2 border-gray-gf7e"
                  : "text-gray-g3b0 border-b-2 border-transparent"
              }`}
            >
              Coming soon
            </button>
          </div>
        </div>

        <div className="flex justify-center py-20 px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-[1200px] w-full">
            {moviesToDisplay.map((movie) => (
              <div
              key={movie.id}
              className="cursor-pointer"
              onClick={() => router.push(`/movies/${movie.id}`)}
            >
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                poster_url={movie.poster_url}
                release_date={movie.release_date ?? undefined}
                rating={movie.rating}
                genre={movie.genre}
              />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AllMoviesWidget;
