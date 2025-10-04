"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MoviesDetailWidget from "@/components/Widgets/MovieDetailWidget";
import DateSelectionBarWidget from "@/components/Widgets/DateSelectionBarWidget";
import InputSearch from "@/components/Inputs/InputSearch";
import ShowTime from "@/components/Widgets/ShowTime";
import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import CitySelection from "@/components/ui/cityselection";
import axios from "axios";
import { APIMovie } from "@/types/movie";


type TimeSlot = {
  id: string;
  start_time: string;
  end_time: string;
};

type Showtime = {
  id: string;
  date: string;
  price: number;
  movie: APIMovie;
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

const MoviesDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const movie_id = params?.id as string | undefined;

  const [data, setData] = useState<Cinema[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getCinemasByMovies = async (movieId: string, date?: Date) => {
    if (!movieId) return;
    console.log(
      "Fetching cinemas for movie_id:",
      movie_id,
      "with date:",
      selectedDate
    );
    try {
      const dateQuery = date ? `&date=${date.toISOString().split("T")[0]}` : "";
      const res = await axios.get(
        `/api/cinemas?movie_id=${movieId}${dateQuery}`
      );
      setData(res.data.cinema);
    } catch (error: unknown) {
      if (error instanceof Error) console.log("Error:", error.message);
    }
  };

  useEffect(() => {
    if (movie_id) getCinemasByMovies(movie_id, selectedDate);
  }, [movie_id, selectedDate]);

  const handleSelectShowtime = (showtimeId: string) => {
    router.push(
      `/movies/${movie_id}/movie-booking/seat?showtime=${showtimeId}`
    );
  };

  const [movie, setMovie] = useState<APIMovie | null>(null);

  const getMovieById = async (movieId: string) => {
    try {
      const res = await axios.get(`/api/movies/${movieId}`);
      setMovie(res.data.movie);
    } catch (error) {
      console.error("Error fetching movie:", error);
    }
  };

  useEffect(() => {
    if (movie_id) getMovieById(movie_id);
  }, [movie_id]);

  return (
    <NavAndFooter>
      <div className="mb-12">
        <MoviesDetailWidget
          movie={
            movie
              ? {
                  ...movie,
                  release_date: movie.release_date
                    ? new Date(movie.release_date)
                    : null,
                }
              : undefined
          }
        />
      </div>

      <DateSelectionBarWidget onSelectDate={(date) => setSelectedDate(date)} />

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
          {data.map((cinema: Cinema) => {
            const groups = cinema.halls
              .map((hall) => ({
                hallId: hall.id,
                hallLabel: hall.name,
                times: hall.showtimes
                  .filter(
                    (showtime) =>
                      new Date(showtime.date).toDateString() ===
                      selectedDate.toDateString()
                  )
                  .map((showtime) => ({
                    id: showtime.id,
                    label: showtime.time_slot.start_time,
                    disabled: false,
                  })),
              }))
              .filter((group) => group.times.length > 0);

            if (groups.length === 0) return null;

            return (
              <div
                key={cinema.id}
                className="w-full md:rounded-md bg-gray-gc1b p-4"
              >
                <ShowTime
                  groups={groups}
                  cinemaName={cinema.name_en}
                  badges={["Hearing assistance", "Wheelchair access"]}
                  onChange={(time) => {
                    if (time) handleSelectShowtime(time.id);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </NavAndFooter>
  );
};

export default MoviesDetail;
