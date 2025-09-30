import React from "react";
import MoviesDetailWidget from "@/components/Widgets/MovieDetailWidget";
import DateSelectionBarWidget from "@/components/Widgets/DateSelectionBarWidget";
import InputSearch from "@/components/Inputs/InputSearch";
import TimeSelectionWidget from "@/components/Widgets/TimeSelectionWidget";
import ShowTime from "@/components/Widgets/ShowTime";
import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import CitySelection from "@/components/ui/cityselection";

const MoviesDetail = () => {
  return (
    <>
      <NavAndFooter>
        <MoviesDetailWidget
          title={"The Dark Knight"}
          image={
            "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg"
          }
          date={"18 Jun 2024"}
          detail={"Lorem, ipsum dolor sit amet consectetur adipisicing elit."}
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
