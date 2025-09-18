import React from "react";
import MoviesDetailWidget from "@/components/Widgets/MovieDetailWidget";
import DateSelectionBarWidget from "@/components/Widgets/DateSelectionBarWidget";
import InputTextFeild from "@/components/Inputs/InputTextFeild";
import TimeSelectionWidget from "@/components/Widgets/TimeSelectionWidget";

const MoviesDetail = () => {
  return (
    <>
      <MoviesDetailWidget
        title={"The Dark Knight"}
        date={"18 Jun 2024"}
        detail={"Lorem, ipsum dolor sit amet consectetur adipisicing elit."}
      />
      <DateSelectionBarWidget />
      <div className="mt-20">
      <InputTextFeild />
      </div>
      <div className="mt-20">
      <TimeSelectionWidget />
      </div>
    </>
  );
};

export default MoviesDetail;
