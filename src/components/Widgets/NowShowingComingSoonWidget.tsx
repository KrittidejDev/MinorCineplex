import MovieCard from "../Cards/MovieCard";

function NowShowingComingSoon() {
  return (
    <div className="w-screen flex justify-center py-20 px-4">
      <div className="flex flex-col gap-10">
        <div className="flex gap-4">
          <button className="font-bold text-f-24 py-1 border-b border-gray-gf7e cursor-pointer">
            Now showing
          </button>
          <button className="font-bold text-f-24 py-1 text-gray-g3b0 border-b border-transparent cursor-pointer">
            Coming soon
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <MovieCard title="Django Unchained" date="24 Jun 2024" rating={4.6} genreTag1="Comedy" genreTag2="Drama" langTag="EN" />
          <MovieCard title="The Dark Knight" date="18 Jun 2024" rating={4.6} genreTag1="Action" genreTag2="Crime" langTag="TH" />
          <MovieCard title="Interstellar" date="24 Jun 2024" rating={4.6} genreTag1="Sci-fi" genreTag2="Drama" langTag="TH/EN" />
          <MovieCard title="Dune: Part Two" date="24 Jun 2024" rating={4.6} genreTag1="Action" genreTag2="Drama" langTag="TH/EN" />
        </div>
      </div>
    </div>
  );
}

export default NowShowingComingSoon;
