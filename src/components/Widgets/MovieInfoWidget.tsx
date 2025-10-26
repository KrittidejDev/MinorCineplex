import React, { useState } from "react";
import MovieCard from "../Cards/MovieCard";
import MovieCardInfo from "../Cards/MovieCardInfo";
import TrailerPlayer from "../Displays/TrailerPlayer";
import InputSearch from "../Inputs/InputSearch";
import DateSelectionBarWidget from "./DateSelectionBarWidget";
import ShowTime from "./ShowTime";
import { MovieDTO, ShowtimeDTO } from "@/types/movie";
import { i18n } from "next-i18next";
import { InputDropdown } from "../Inputs/InputDropdown";
import InputComboBox from "../Inputs/InputComboBox";
import { provinces } from "@/lib/data/provincesData";

interface MoviesDetailWidgetProps {
  movie: MovieDTO;
  showtimes: ShowtimeDTO[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  showtimesLoading?: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchCity: string;
  setSearchCity: (value: string) => void;
}

const MovieInfoWidget: React.FC<MoviesDetailWidgetProps> = ({
  movie,
  showtimes,
  onSelectDate,
  searchValue,
  setSearchValue,
  searchCity,
  setSearchCity,
}) => {
  const [activeTab, setActiveTab] = useState("ข้อมูลภาพยนต์");
  console.log(showtimes);
  const splitName = (name: string) => {
    const [firstName, ...rest] = name.split(" ");
    return { firstName, lastName: rest.join(" ") };
  };

  const filterBtnStyle =
    "bg-gray-g63f h-11 py-2 px-4 rounded-sm flex items-center";
  const filterActiveStyle =
    "bg-gray-gf7e h-11 py-1 px-4 rounded-sm flex items-center";

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };
  console.log("searchCity", searchCity);

  const slug = (
    i18n?.language === "en"
      ? movie?.translations?.en?.title
      : movie?.translations?.th?.title
  )?.replace(/\s+/g, "");

  const renderShowTimes = () => {
    if (showtimes.length > 0) {
      return showtimes.map((data) => {
        const newData = { ...data, slug };
        return (
          <div
            key={data?.cinema?.id}
            className="w-full rounded-md bg-gray-gc1b p-4 mb-4"
          >
            <ShowTime
              data={newData}
              badges={["Hearing assistance", "Wheelchair access"]}
              autoNavigate
            />
          </div>
        );
      });
    }
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-400">ไม่พบรอบฉายในวันที่เลือก</p>
      </div>
    );
  };

  return (
    <div className="md:mt-6 z-10 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col">
        {/* Mobile Trailer */}
        <div className="md:hidden">
          <TrailerPlayer
            url={movie.trailer_url}
            className="w-full h-full object-cover rounded-none"
          />
        </div>

        {/* Movie Card Section */}

        <div className="hidden md:flex justify-between gap-x-10 bg-gray-gc1b/70 px-6 py-4 rounded-2xl">
          <MovieCard
            id={movie.id}
            title={movie.title}
            poster_url={movie.poster_url || undefined}
            release_date={
              movie.release_date ? new Date(movie.release_date) : undefined
            }
            rating={movie.rating || undefined}
            genres={[...movie.genres, ...movie.languages]}
          />
          <TrailerPlayer url={movie.trailer_url} />
        </div>

        <div className="md:hidden py-10">
          <MovieCardInfo
            id={movie.id}
            title={movie.title}
            poster_url={movie.poster_url || undefined}
            release_date={
              movie.release_date ? new Date(movie.release_date) : undefined
            }
            rating={movie.rating || undefined}
            genres={[...movie.genres, ...movie.languages]}
          />
        </div>

        {/* Tabs - Desktop Only */}
        <div className="hidden md:flex gap-10 mt-12">
          <button
            className={`  ${
              activeTab === "ข้อมูลภาพยนต์" ? filterActiveStyle : filterBtnStyle
            }`}
            onClick={() => setActiveTab("ข้อมูลภาพยนต์")}
          >
            ข้อมูลภาพยนต์
          </button>
          <button
            className={`text-[20px] font-semibold cursor-pointer ${
              activeTab === "รอบฉาย" ? filterActiveStyle : filterBtnStyle
            }`}
            onClick={() => setActiveTab("รอบฉาย")}
          >
            รอบฉาย
          </button>
        </div>

        {/* ข้อมูลภาพยนต์ - Desktop Only */}
        {activeTab === "ข้อมูลภาพยนต์" && (
          <div className="hidden md:flex flex-col gap-10 mt-10">
            {/* นักแสดง */}
            <div>
              <h3 className="font-bold text-f-24">นักแสดง</h3>
              <div className="flex flex-wrap gap-2.5 mt-5">
                {movie.actors.map((actor) => {
                  const { firstName, lastName } = splitName(actor.actor.name);
                  return (
                    <div
                      key={actor.actor.id}
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
                {movie.directors.map((director) => {
                  const { firstName, lastName } = splitName(
                    director.director.name
                  );
                  return (
                    <div
                      key={director.director.id}
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
                    __html: movie.translations?.th?.description || movie.title,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* รอบฉาย Section - Mobile always shows, Desktop shows when activeTab === "รอบฉาย" */}
        <div className={activeTab === "รอบฉาย" ? "" : "md:hidden"}>
          <div className="mt-10 px-0 ">
            <div className="w-full flex flex-col md:flex-row gap-5 items-center justify-center">
              <div className="w-full md:max-w-[895px]">
                <InputSearch
                  handleSearch={handleSearch}
                  value={searchValue}
                  placeholder="Search cinema"
                />
              </div>
              <div className="w-full md:w-[285px]">
                <InputComboBox
                  value={searchCity}
                  placeholder="Search city"
                  options={provinces.map((province) => ({
                    value: province.name_th,
                    label: province.name_th,
                  }))}
                  onChange={setSearchCity}
                />
              </div>
            </div>

            <div className="mt-5">
              <DateSelectionBarWidget onSelectDate={onSelectDate} />
            </div>

            <div className="max-w-[1200px] mx-auto">
              <div className="w-full my-10">{renderShowTimes()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfoWidget;
