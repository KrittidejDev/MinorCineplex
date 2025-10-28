import React, { useEffect, useState, useCallback } from "react";
import DateSelectionBarWidget from "./DateSelectionBarWidget";
import Image from "next/image";
import NavAndFooter from "../MainLayout/NavAndFooter";
import { CinemaDetail, CinemaDTO, MovieWithHalls } from "@/types/cinema";
import { useTranslation } from "next-i18next";
import { HoverCard3D } from "../Displays/HoverCard3D";
import axios from "axios";
import { useParams } from "next/navigation";
import ShowtimeMovie from "./ShowtimeMovie";

const CinemaDetailWidget: React.FC = () => {
  const params = useParams();
  const cinemaSlug = params?.slug as string;
  const { i18n } = useTranslation();
  const [cinemaData, setCinemaData] = useState<CinemaDTO>();
  const [filterDate, setFilterDate] = useState<Date>();
  const [showtimesData, setShowtimesData] = useState<MovieWithHalls[]>();

  const fetchCinema = async () => {
    if (!cinemaSlug) return;
    try {
      const res = await axios.get<{
        status: number;
        message: string;
        data: CinemaDetail;
      }>(`/api/cinemas/${cinemaSlug}`);
      if (res.status === 200) {
        setCinemaData(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCinema();
  }, [cinemaSlug]);

  const fetchCinemaShowtimes = async (date?: Date) => {
    try {
      if (!cinemaSlug) {
        return;
      }
      const targetDate = date || new Date();
      if (isNaN(targetDate.getTime())) {
        throw new Error("Invalid date format");
      }
      const dateString = targetDate.toISOString().split("T")[0];
      const res = await axios.get<{
        status: number;
        message: string;
        data: MovieWithHalls[];
      }>(`/api/cinemas/${cinemaSlug}/showtimes?date=${dateString}`);
      if (res.status === 200) {
        setShowtimesData(res.data.data);
      }
      return null;
    } catch (error) {
      console.error("Error fetching cinema showtimes:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchCinemaShowtimes(filterDate);
  }, [filterDate, cinemaSlug]);

  const handleSelectDate = (date: Date) => {
    setFilterDate(date);
  };

  return (
    <NavAndFooter>
      <Image
        src="/images/cover-cinema.png"
        alt="Cinema Interior"
        fill
        className="hidden md:flex object-cover object-center w-full z-0 max-h-[583px] overflow-hidden "
      />

      <div className="w-dvw flex-1 flex flex-col items-center box-border">
        <div className="w-full max-w-[1200px] md:my-[43px] flex flex-col items-center z-5 bg-gray-gc1b/70 md:rounded-lg p-4 lg:p-0">
          <div className="flex w-full mb-6 md:mb-0">
            <div className="flex flex-1 md:max-w-[274px] box-border overflow-hidden object-cover object-center rounded-sm md:rounded-none">
              <HoverCard3D>
                <Image
                  src="/images/cinema.webp"
                  alt="Cinema Interior"
                  className="md:h-[400px] min-w-[126px] md:w-full max-w-[274px] object-cover overflow-hidden"
                  width={274}
                  height={400}
                />
              </HoverCard3D>
            </div>
            <div className="flex flex-col flex-1 w-full p-4 md:p-[60px]">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-6 whitespace-pre-wrap">
                {i18n.language === "en"
                  ? cinemaData?.translations?.en?.name
                  : cinemaData?.translations?.th?.name}
              </h1>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 rounded-full bg-gray-600 text-white text-sm font-medium">
                  Hearing assistance
                </span>
                <span className="px-4 py-2 rounded-full bg-gray-600 text-white text-sm font-medium">
                  Wheelchair access
                </span>
              </div>
              <div className="md:block space-y-4  hidden flex-1">
                <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap max-h-[110px] overflow-y-auto">
                  {i18n.language
                    ? cinemaData?.translations?.en?.description
                    : cinemaData?.translations?.th?.description}
                </p>
                {cinemaData?.address && (
                  <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap line-clamp-2">
                    <span>
                      {i18n.language === "en" ? "Address" : "ที่อยู่"} :{" "}
                    </span>
                    <span>{cinemaData?.address}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden p-4 flex flex-1 flex-col w-full">
            <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap max-h-[110px] overflow-y-auto">
              {i18n.language
                ? cinemaData?.translations?.en?.description
                : cinemaData?.translations?.th?.description}
            </p>
            {cinemaData?.address && (
              <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap line-clamp-2">
                <span>{i18n.language === "en" ? "Address" : "ที่อยู่"} : </span>
                <span>{cinemaData?.address}</span>
              </p>
            )}
          </div>
        </div>
        <div className="z-1 w-full flex justify-center items-center">
          <div className="max-w-[1200px]">
            <DateSelectionBarWidget onSelectDate={handleSelectDate} />
          </div>
        </div>
        <section className="w-dvw py-4 sm:px-0">
          <div className="space-y-6 py-10 md:py-20">
            {showtimesData?.map((movie) => (
              <div key={movie.movie.id}>
                <ShowtimeMovie data={movie} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </NavAndFooter>
  );
};

export default CinemaDetailWidget;
