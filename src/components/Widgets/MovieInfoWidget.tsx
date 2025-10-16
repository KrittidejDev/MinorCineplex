"use client";

import React, { useState, useEffect, useCallback } from "react";
import MovieCard from "../Cards/MovieCard";
import MovieCardInfo from "../Cards/MovieCardInfo";
import { APIMovie } from "@/types/movie";
import TrailerPlayer from "../Displays/TrailerPlayer";
import { ActorProfile, DirectorProfile } from "../ui/actordirectorlist";
import InputSearch from "../Inputs/InputSearch";
import CitySelection from "../ui/cityselection";
import DateSelectionBarWidget from "./DateSelectionBarWidget";
import ShowTime from "./ShowTime";
import axios from "axios";

interface MoviesDetailWidgetProps {
  movie: APIMovie;
}

type TimeSlotShowtime = {
  showtime_id: string;
  start_time: string;
  end_time: string;
  available_seats: number;
  total_seats: number;
};

type HallShowtime = {
  id: string;
  name: string;
  timeslots: TimeSlotShowtime[];
};

type CinemaShowtime = {
  id: string;
  name: string;
  halls: HallShowtime[];
  name_en?: string;
};

type MovieShowtimeDetail = {
  cinemas: CinemaShowtime[];
};

const MovieInfoWidget: React.FC<MoviesDetailWidgetProps> = ({ movie }) => {
  const [activeTab, setActiveTab] = useState("ข้อมูลภาพยนต์");
  const [movieData, setMovieData] = useState<MovieShowtimeDetail | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);

  // ฟังก์ชันช่วยแยกชื่อ Actor/Director
  const splitName = (name: string) => {
    const [firstName, ...rest] = name.split(" ");
    return { firstName, lastName: rest.join(" ") };
  };

  // ดึงรอบฉายจาก API
  const getMovieShowtimes = useCallback(async (movieId: string, date: Date) => {
    setLoading(true);
    try {
      const dateQuery = date ? `?date=${date.toISOString().split("T")[0]}` : "";
      const res = await axios.get(`/api/movie-showtime/${movieId}${dateQuery}`);
      setMovieData(res.data.data);
    } catch (err) {
      console.error(err);
      setMovieData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (movie?.id) {
      getMovieShowtimes(movie.id, selectedDate);
    }
  }, [movie?.id, selectedDate, getMovieShowtimes]);

  // --- Move this check after all hooks ---
  if (!movie) return <p>ไม่พบข้อมูลหนัง</p>;

  return (
    <>
      {/* Desktop Size */}
      <div className="hidden md:block">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between">
            <MovieCard
              id={movie.id}
              title={movie.title}
              poster_url={movie.poster_url || undefined}
              release_date={
                movie.release_date ? new Date(movie.release_date) : undefined
              }
              rating={movie.rating || undefined}
              genre={movie.genre || undefined}
            />
            <TrailerPlayer url={movie.trailer_url} />
          </div>

          {/* Tabs */}
          <div className="flex gap-10 mt-10">
            <button
              className={`text-[20px] font-semibold cursor-pointer ${
                activeTab === "ข้อมูลภาพยนต์"
                  ? "text-blue-bbee"
                  : "text-white-wfff"
              }`}
              onClick={() => setActiveTab("ข้อมูลภาพยนต์")}
            >
              ข้อมูลภาพยนต์
            </button>
            <button
              className={`text-[20px] font-semibold cursor-pointer ${
                activeTab === "รอบฉาย" ? "text-blue-bbee" : "text-white-wfff"
              }`}
              onClick={() => setActiveTab("รอบฉาย")}
            >
              รอบฉาย
            </button>
          </div>

          {/* ข้อมูลภาพยนต์ */}
          {activeTab === "ข้อมูลภาพยนต์" && (
            <div className="flex flex-col gap-10 mt-10">
              {/* นักแสดง */}
              <div>
                <h3 className="font-bold text-f-24">นักแสดง</h3>
                <div className="flex flex-wrap gap-2.5 mt-5">
                  {(movie.actors || []).map((actor) => {
                    const { firstName, lastName } = splitName(actor.name);
                    return actor.imageUrl ? (
                      <ActorProfile
                        key={actor.id}
                        firstName={firstName}
                        lastName={lastName}
                        imageUrl={actor.imageUrl}
                      />
                    ) : (
                      <div
                        key={actor.id}
                        className="flex flex-col items-center text-white-wfff text-sm"
                      >
                        <span>{firstName}</span>
                        {lastName && <span>{lastName}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ผู้กำกับ */}
              <div>
                <h3 className="font-bold text-f-24">ผู้กำกับ</h3>
                <div className="flex flex-wrap gap-2.5 mt-5">
                  {(movie.directors || []).map((director) => {
                    const { firstName, lastName } = splitName(director.name);
                    return director.imageUrl ? (
                      <DirectorProfile
                        key={director.id}
                        firstName={firstName}
                        lastName={lastName}
                        imageUrl={director.imageUrl}
                      />
                    ) : (
                      <div
                        key={director.id}
                        className="flex flex-col items-center text-white-wfff text-sm"
                      >
                        <span>{firstName}</span>
                        {lastName && <span>{lastName}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* เรื่องย่อ */}
              <div>
                <h3 className="font-bold text-f-24">เรื่องย่อ</h3>
                <div className="mt-5">
                  <p
                    className="font-bold"
                    dangerouslySetInnerHTML={{
                      __html: movie.description ?? "",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* รอบฉาย */}
        {activeTab === "รอบฉาย" && (
          <div className="mt-10">
            <div className="flex flex-col lg:flex-row gap-5 items-center justify-center px-4">
              <div className="w-full lg:w-[895px]">
                <InputSearch />
              </div>
              <div className="w-full lg:w-[285px]">
                <CitySelection />
              </div>
            </div>

            <div className="mt-5">
              <DateSelectionBarWidget onSelectDate={setSelectedDate} />
            </div>
            <div className="max-w-[1200px] mx-auto">
              <div className="w-full my-10">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <p className="text-gray-400">Loading...</p>
                  </div>
                ) : movieData && movieData.cinemas.length > 0 ? (
                  movieData.cinemas.map((cinema) => {
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
                        className="w-full md:rounded-md bg-gray-gc1b p-4 mb-4"
                      >
                        <ShowTime
                          groups={groups}
                          cinemaName={cinema.name_en || cinema.name}
                          badges={["Hearing assistance", "Wheelchair access"]}
                          autoNavigate
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="flex justify-center items-center py-20">
                    <p className="text-gray-400">ไม่พบรอบฉายในวันที่เลือก</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Size */}
      <div className="md:hidden">
        <TrailerPlayer
          url={movie.trailer_url}
          className="w-full h-full object-cover rounded-none"
        />
        <div className="px-4 py-10">
          <MovieCardInfo
            id={movie.id}
            title={movie.title}
            poster_url={movie.poster_url || undefined}
            release_date={
              movie.release_date ? new Date(movie.release_date) : undefined
            }
            rating={movie.rating || undefined}
            genre={movie.genre || undefined}
          />
        </div>
        <div className="mt-10">
          <DateSelectionBarWidget onSelectDate={setSelectedDate} />
          <div className="px-4 py-10">
            <div className="flex flex-col lg:flex-row gap-5 items-center justify-center mt-5">
              <div className="w-full">
                <InputSearch />
              </div>
              <div className="w-full">
                <CitySelection />
              </div>
            </div>

            <div className="w-full my-10">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <p className="text-gray-400">Loading...</p>
                </div>
              ) : movieData && movieData.cinemas.length > 0 ? (
                movieData.cinemas.map((cinema) => {
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
                      className="w-full rounded-md bg-gray-gc1b p-4 mb-4"
                    >
                      <ShowTime
                        groups={groups}
                        cinemaName={cinema.name_en || cinema.name}
                        badges={["Hearing assistance", "Wheelchair access"]}
                        autoNavigate
                      />
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-center items-center py-20">
                  <p className="text-gray-400">ไม่พบรอบฉายในวันที่เลือก</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieInfoWidget;
