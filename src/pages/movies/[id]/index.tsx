import React from "react";
import MoviesDetailWidget from "@/components/Widgets/MovieDetailWidget";
import DateSelectionBarWidget from "@/components/Widgets/DateSelectionBarWidget";
import InputSearch from "@/components/Inputs/InputSearch";
import TimeSelectionWidget from "@/components/Widgets/TimeSelectionWidget";
import ShowTime from "@/components/Widgets/ShowTime";
import NavAndFooter from "@/components/MainLayout/NavAndFooter";

const MoviesDetail = () => {
  return (
    <>
      <NavAndFooter>
        <MoviesDetailWidget
          title={"The Dark Knight"}
          date={"18 Jun 2024"}
          detail={"Lorem, ipsum dolor sit amet consectetur adipisicing elit."}
        />
        <DateSelectionBarWidget />
        <div className="w-[1200px] flex mx-auto mt-20">
          <InputSearch />
        </div>
        <div className="mt-20">
          {/* <TimeSelectionWidget /> */}
          <div className="flex flex-col items-center">
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
