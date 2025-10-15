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

// Types สำหรับ API ใหม่
type TimeSlotShowtime = {
  showtime_id: string;
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  price: number;
  date: string;
  available_seats: number;
  total_seats: number;
};

type HallShowtime = {
  id: string;
  name: string;
  seat_count?: number;
  timeslots: TimeSlotShowtime[];
};

type CinemaShowtime = {
  id: string;
  name: string;
  name_en?: string;
  address: string;
  phone?: string;
  province?: string;
  province_en?: string;
  halls: HallShowtime[];
};

type MovieShowtimeDetail = {
  id: string;
  title: string;
  title_en?: string;
  duration_min: number;
  description?: string;
  description_en?: string;
  poster_url?: string;
  trailer_url?: string;
  genre?: string;
  genre_en?: string;
  rating?: string;
  release_date?: string;
  cinemas: CinemaShowtime[];
};

const MoviesDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const movie_id = params?.id as string | undefined;

  const [movieData, setMovieData] = useState<MovieShowtimeDetail | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);

  // ดึงข้อมูลหนังและรอบฉายจาก API ใหม่
  const getMovieShowtimes = async (movieId: string, date?: Date) => {
    if (!movieId) return;

    setLoading(true);
    try {
      const dateQuery = date ? `?date=${date.toISOString().split("T")[0]}` : "";
      const res = await axios.get(`/api/movie-showtime/${movieId}${dateQuery}`);
      setMovieData(res.data.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error:", error.message);
      }
      setMovieData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movie_id) {
      getMovieShowtimes(movie_id, selectedDate);
    }
  }, [movie_id, selectedDate]);

  // แปลงข้อมูลสำหรับ MoviesDetailWidget
  const movieForWidget: APIMovie | undefined = movieData
    ? {
        id: movieData.id,
        title: movieData.title,
        duration_min: movieData.duration_min,
        description: movieData.description || null,
        poster_url: movieData.poster_url || null,
        trailer_url: movieData.trailer_url || null,
        genre: movieData.genre || null,
        rating: movieData.rating || null,
        release_date: movieData.release_date
          ? new Date(movieData.release_date)
          : null,
        actors: [],
        directors: [],
        created_at: new Date(),
        updated_at: new Date(),
      }
    : undefined;

  return (
    <NavAndFooter>
      <div className="mb-12">
        <MoviesDetailWidget movie={movieForWidget} />
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
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : movieData && movieData.cinemas.length > 0 ? (
          <div className="flex flex-col items-center gap-6 md:px-4">
            {movieData.cinemas.map((cinema) => {
              const groups = cinema.halls
                .map((hall) => ({
                  hallId: hall.id,
                  hallLabel: hall.name,
                  times: hall.timeslots.map((timeslot) => ({
                    id: timeslot.showtime_id,
                    label: timeslot.start_time,
                    start_time: timeslot.start_time,
                    end_time: timeslot.end_time,
                    availableSeats: timeslot.available_seats,
                    totalSeats: timeslot.total_seats,
                    disabled: timeslot.available_seats === 0,
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
                    cinemaName={cinema.name_en || cinema.name}
                    badges={["Hearing assistance", "Wheelchair access"]}
                    autoNavigate={true}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-400">ไม่พบรอบฉายในวันที่เลือก</p>
          </div>
        )}
      </div>
    </NavAndFooter>
  );
};

export default MoviesDetail;
