import React, { useState } from "react";
import MovieCard from "../Cards/MovieCard";
import { APIMovie } from "@/types/movie";
import { useRouter } from "next/router";

interface NowShowingComingSoonProps {
  movies: APIMovie[];
  loading: boolean;
  showAll?: boolean; // ถ้า true = search result ให้แสดงรวมทั้งหมด
}

export default function NowShowingComingSoon({
  movies,
  loading,
  showAll = false,
}: NowShowingComingSoonProps) {
  const [activeTab, setActiveTab] = useState("nowShowing");
  const router = useRouter();
  const today = new Date();

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!movies || movies.length === 0)
    return <div className="text-center py-20">No movies found</div>;

  let moviesToDisplay;

  if (showAll) {
    // search mode: แสดงทั้งหมดรวมกัน
    moviesToDisplay = movies;
  } else {
    // normal mode: แยก Now Showing / Coming Soon และ slice 4 เรื่อง
    const nowShowingMovies = movies
      .filter((m) => m.release_date && new Date(m.release_date) <= today)
      .slice(0, 4);

    const comingSoonMovies = movies
      .filter((m) => m.release_date && new Date(m.release_date) > today)
      .slice(0, 4);

    moviesToDisplay =
      activeTab === "nowShowing" ? nowShowingMovies : comingSoonMovies;
  }

  return (
    <div className="w-screen flex justify-center py-20 px-4">
      <div className="flex flex-col gap-10">
        {!showAll && (
          <div className="flex justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("nowShowing")}
                className={`font-bold text-f-24 py-1 cursor-pointer ${
                  activeTab === "nowShowing"
                    ? "text-white-wfff border-b border-gray-gf7e"
                    : "text-gray-g3b0 border-b border-transparent"
                }`}
              >
                Now showing
              </button>
              <button
                onClick={() => setActiveTab("comingSoon")}
                className={`font-bold text-f-24 py-1 cursor-pointer ${
                  activeTab === "comingSoon"
                    ? "text-white-wfff border-b border-gray-gf7e"
                    : "text-gray-g3b0 border-b border-transparent"
                }`}
              >
                Coming soon
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {moviesToDisplay.map((movie) => (
            <div
              key={movie.id}
              className="cursor-pointer"
              onClick={() => router.push(`/movies/${movie.id}`)}
            >
              <MovieCard
                id={movie.id}
                title={movie.title}
                poster_url={movie.poster_url}
                release_date={movie.release_date || undefined}
                rating={movie.rating}
                genre={movie.genre}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
