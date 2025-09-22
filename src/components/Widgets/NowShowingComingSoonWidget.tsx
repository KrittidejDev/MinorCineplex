import MovieCard from "../Cards/MovieCard";
import { useState } from "react";

function NowShowingComingSoon() {
  const [activeTab, setActiveTab] = useState("nowShowing");

  const nowShowingMovies = [
    {
      title: "Django Unchained",
      image:
        "https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_FMjpg_UX1000_.jpg",
      date: "24 Jun 2024",
      rating: 4.6,
      genreTag1: "Comedy",
      genreTag2: "Drama",
      langTag: "EN",
    },
    {
      title: "The Dark Knight",
      image:
        "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      date: "18 Jun 2024",
      rating: 4.6,
      genreTag1: "Action",
      genreTag2: "Crime",
      langTag: "TH",
    },
    {
      title: "Interstellar",
      image:
        "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      date: "10 Jul 2024",
      rating: 4.8,
      genreTag1: "Sci-fi",
      genreTag2: "Drama",
      langTag: "TH/EN",
    },
    {
      title: "Dune: Part Two",
      image:
        "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      date: "20 Jul 2024",
      rating: 4.9,
      genreTag1: "Action",
      genreTag2: "Drama",
      langTag: "TH/EN",
    },
  ];

  const comingSoonMovies = [
    {
      title: "Django Unchained",
      image:
        "https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_FMjpg_UX1000_.jpg",
      date: "24 Jun 2024",
      rating: 4.6,
      genreTag1: "Comedy",
      genreTag2: "Drama",
      langTag: "EN",
    },
    {
      title: "The Dark Knight",
      image:
        "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      date: "18 Jun 2024",
      rating: 4.6,
      genreTag1: "Action",
      genreTag2: "Crime",
      langTag: "TH",
    },
    {
      title: "Interstellar",
      image:
        "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      date: "10 Jul 2024",
      rating: 4.8,
      genreTag1: "Sci-fi",
      genreTag2: "Drama",
      langTag: "TH/EN",
    },
    {
      title: "Dune: Part Two",
      image:
        "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      date: "20 Jul 2024",
      rating: 4.9,
      genreTag1: "Action",
      genreTag2: "Drama",
      langTag: "TH/EN",
    },
  ];

  const moviesToDisplay = activeTab === "nowShowing" ? nowShowingMovies : comingSoonMovies

  return (
    <div className="w-screen flex justify-center py-20 px-4">
      <div className="flex flex-col gap-10">
        <div className="flex gap-4">
          <button onClick={() => setActiveTab("nowShowing")} className={`font-bold text-f-24 py-1 cursor-pointer ${activeTab === "nowShowing" ? "text-white-wfff border-b border-gray-gf7e" : "text-gray-g3b0 border-b border-transparent"}`}>
            Now showing
          </button>
          <button onClick={() => setActiveTab("comingSoon")} className={`font-bold text-f-24 py-1 cursor-pointer ${activeTab === "comingSoon" ? "text-white-wfff border-b border-gray-gf7e" : "text-gray-g3b0 border-b border-transparent"}`}>
            Coming soon
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <MovieCard title="Django Unchained" image="https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_FMjpg_UX1000_.jpg" date="24 Jun 2024" rating={4.6} genreTag1="Comedy" genreTag2="Drama" langTag="EN" />
          <MovieCard title="The Dark Knight" image="https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg" date="18 Jun 2024" rating={4.6} genreTag1="Action" genreTag2="Crime" langTag="TH" />
          <MovieCard title="Interstellar" image="https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" date="24 Jun 2024" rating={4.6} genreTag1="Sci-fi" genreTag2="Drama" langTag="TH/EN" />
          <MovieCard title="Dune: Part Two" image="https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" date="24 Jun 2024" rating={4.6} genreTag1="Action" genreTag2="Drama" langTag="TH/EN" />
        </div>
      </div>
    </div>
  );
}

export default NowShowingComingSoon;
