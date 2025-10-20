import React, { useState, useEffect } from "react";
import MovieCard from "../Cards/MovieCard";
import { MovieDTO } from "@/types/movie";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";
import { FilterData } from "./FilterSearch";
import { MovieStatus } from "@/types/enums";

interface NowShowingComingSoonProps {
  movies: MovieDTO[];
  query: FilterData;
  loading: boolean;
  onTabClick: (tab: MovieStatus) => void;
}

export default function NowShowingComingSoon({
  movies,
  loading,
  query,
  onTabClick,
}: NowShowingComingSoonProps) {
  const router = useRouter();

  const initialTab = query.status || MovieStatus.NOW_SHOWING;
  const [activeTab, setActiveTab] = useState<MovieStatus>(initialTab);

  useEffect(() => {
    setActiveTab(query.status || MovieStatus.NOW_SHOWING);
  }, [query.status]);

  const moviesToDisplay = movies
    .filter((m) =>
      activeTab === MovieStatus.NOW_SHOWING
        ? m.status === MovieStatus.NOW_SHOWING
        : m.status === MovieStatus.COMING_SOON
    )
    .slice(0, 4);

  const handleTab = (tab: MovieStatus) => {
    setActiveTab(tab);
    onTabClick(tab);
  };

  return (
    <div className="w-screen flex justify-center py-20 px-4">
      <div className="w-full max-w-[1200px] flex flex-col gap-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => handleTab(MovieStatus.NOW_SHOWING)}
              className={`font-bold text-f-24 py-1 cursor-pointer ${
                activeTab === MovieStatus.NOW_SHOWING
                  ? "text-white-wfff border-b border-gray-gf7e"
                  : "text-gray-g3b0 border-b border-transparent"
              }`}
            >
              Now showing
            </button>
            <button
              onClick={() => handleTab(MovieStatus.COMING_SOON)}
              className={`font-bold text-f-24 py-1 cursor-pointer ${
                activeTab === MovieStatus.COMING_SOON
                  ? "text-white-wfff border-b border-gray-gf7e"
                  : "text-gray-g3b0 border-b border-transparent"
              }`}
            >
              Coming soon
            </button>
          </div>
          <Link href="/movies" passHref>
            <Button className="btn-base-transparent-underline-normal text-sm hover:underline cursor-pointer">
              View all
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : moviesToDisplay.length === 0 ? (
          <div className="text-center py-20">No movies found</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {moviesToDisplay.map((movie) => (
              <div
                key={movie.id}
                className="cursor-pointer"
                onClick={() => router.push(`/movies/${movie.slug}`)}
              >
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  poster_url={movie.poster_url}
                  release_date={movie.release_date || undefined}
                  rating={movie.rating}
                  genres={[...movie.genres, ...movie.languages]}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
