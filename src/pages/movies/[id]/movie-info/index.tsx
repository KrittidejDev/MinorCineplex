import NavAndFooterWithBanner from "@/components/MainLayout/NavAndFooterWithBanner";
import FilterSearch from "@/components/Widgets/FilterSearch";
import MovieInfoWidget from "@/components/Widgets/MovieInfoWidget";

function MovieInfo() {
  return (
    <>
      <NavAndFooterWithBanner>
        <div className=" max-w-[1200px] mx-auto">
          <FilterSearch />
          <div className="mt-10">
            <MovieInfoWidget />
          </div>
        </div>
      </NavAndFooterWithBanner>
    </>
  );
}

export default MovieInfo;
