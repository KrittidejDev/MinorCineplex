import { useRouter } from "next/router";
import React from "react";
import MoviesDetailWidget from "@/components/Widgets/MovieDetailWidget";
import DateSelectionBarWidget from "@/components/Widgets/DateSelectionBarWidget";
import InputSearch from "@/components/Inputs/InputSearch";
import TimeSelectionWidget from "@/components/Widgets/TimeSelectionWidget";
import ShowTime from "@/components/Widgets/ShowTime";
import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import CitySelection from "@/components/ui/cityselection";

const MoviesDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <p>Loading...</p>;

  const movieId = Array.isArray(id) ? id[0] : id;

  return (
    <>
      <NavAndFooter>
        <MoviesDetailWidget id={movieId}
        />
        <DateSelectionBarWidget />
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-5 items-center justify-center px-4 mt-10 lg:mt-20">
          <div className="w-full lg:w-[895px]">
            <InputSearch />
          </div>
          <div className="w-full lg:w-[285px]">
            <CitySelection />
          </div>
        </div>

        <div className="mt-10 lg:mt-20">
          {/* <TimeSelectionWidget /> */}
          <div className="flex flex-col items-center px-4">
            <ShowTime />
            <ShowTime />
            <ShowTime />
          </div>
        </div>
      </NavAndFooter>
    </>
  );
};

export default MoviesDetail;
