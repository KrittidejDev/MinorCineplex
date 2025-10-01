import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MoviesDetailWidget from "@/components/Widgets/MovieDetailWidget";
import DateSelectionBarWidget from "@/components/Widgets/DateSelectionBarWidget";
import InputSearch from "@/components/Inputs/InputSearch";
import ShowTime from "@/components/Widgets/ShowTime";
import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import CitySelection from "@/components/ui/cityselection";
import axios from "axios";
import timeFormat from "@/lib/timeFormat";

type Movie = {
  id: string;
  title: string;
  poster_url: string;
  release_date: string;
  description: string;
  duration_min: number;
};

type TimeSlot = {
  id: string;
  start_time: string;
  end_time: string;
};

type Showtime = {
  id: string;
  date: string;
  price: number;
  movie: Movie;
  time_slot: TimeSlot;
};

type Hall = {
  id: string;
  name: string;
  showtimes: Showtime[];
};

type Cinema = {
  id: string;
  name: string;
  name_en: string;
  halls: Hall[];
};

const MoviesDetail = () => {


  const [data, setData] = useState<Cinema[]>([]);

  const getCinemasByMovies = async () => {
    try {
      const {data} = await axios.get(
        `http://localhost:3000/api/cinemas?movie_id=02ab9972-6a80-498c-bafb-960a4fd9dae5`
      );
      setData(data.cinema);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error:", error.message);
      }
    }
  };

  useEffect(() => {
    getCinemasByMovies();
  }, []);

  const cinemas = data;

  return (
    <>
      <NavAndFooter>
        <MoviesDetailWidget
          movie={data[0]?.halls[0]?.showtimes[0]?.movie}
        />
        <DateSelectionBarWidget />
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-5 items-center justify-center px-4 mt-10">
          <div className="w-full lg:w-[895px]">
            <InputSearch />
          </div>
          <div className="w-full lg:w-[285px]">
            <CitySelection />
          </div>
        </div>

        <div className="w-full max-w-[1200px] mx-auto my-10">
          <div className="flex flex-col items-center gap-6 md:px-4">
            {cinemas.map((cinema: Cinema) => {
              const groups = cinema.halls.map((hall) => ({
                hallId: hall.id,
                hallLabel: hall.name,
                times: hall.showtimes.map((showtime) => ({
                  id: showtime.id,
                  label: timeFormat(showtime.time_slot.start_time),
                  disabled: false,
                })),
              }));

              return (
                <div
                  key={cinema.id}
                  className="w-full md:rounded-md bg-gray-gc1b p-4"
                >
                  <ShowTime
                    groups={groups}
                    cinemaName={cinema.name_en}
                    badges={["Hearing assistance", "Wheelchair access"]}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </NavAndFooter>
    </>
  );
};

export default MoviesDetail;
