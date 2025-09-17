import MovieCard from "../Cards/MovieCard";

function NowShowingComingSoon() {
  return (
    <div className="flex w-screen justify-center py-20">
      <div className="flex flex-col gap-10">
        <div className="flex gap-4">
          <button className="font-bold text-2xl py-1 border-b cursor-pointer">Now showing</button>
          <button className="font-bold text-2xl py-1 text-[#8B93B0] border-b border-transparent cursor-pointer">Coming soon</button>
        </div>
        <div className="flex gap-5">
          <MovieCard title={"Django Unchained"} date={"24 Jun 2024"} rating={4.6} genre1={"Comedy"} genre2={"Drama"} lang={"EN"} />
          <MovieCard title={"The Dark Knight"} date={"18 Jun 2024"} rating={4.6} genre1={"Action"} genre2={"Crime"} lang={"TH"} />
          <MovieCard title={"Interstellar"} date={"24 Jun 2024"} rating={4.6} genre1={"Sci-fi"} genre2={"Drama"} lang={"TH/EN"} />
          <MovieCard title={"Dune: Part Two"} date={"24 Jun 2024"} rating={4.6} genre1={"Action"} genre2={"Drama"} lang={"TH/EN"} />
        </div>
      </div>
    </div>
  );
}

export default NowShowingComingSoon;
