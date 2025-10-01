import React, { useEffect, useState } from "react";
import ShowtimeMovie from "./ShowtimeMovie";
import DateSelectionBarWidget from "./DateSelectionBarWidget";
import NavBarWidget from "./NavBarWidget";
import FooterWidget from "./FooterWidget";
import Image from "next/image";
import NavAndFooter from "../MainLayout/NavAndFooter";
import { useParams } from "next/navigation";
import { userService } from "@/config/userServices";
import { CinemaDetail } from "@/types/cinema";
import { useTranslation } from "react-i18next";
import { RENDER_TIME_TH } from "@/lib/utils/dateTimeFormat";

interface CinemaDetallWidgetProps {
  image?: string;
  movie1Poster?: string;
  movie2Poster?: string;
  movie3Poster?: string;
  movie4Poster?: string;
}

const CinemaDetallWidget = ({
  image = "/images/banner.png",
  movie1Poster = "https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_FMjpg_UX1000_.jpg",
  movie2Poster = "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
  movie3Poster = "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  movie4Poster = "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
}: CinemaDetallWidgetProps) => {
  const { i18n } = useTranslation();
  const params = useParams();
  const id = params?.id;
  const [cinemaData, setCinemaData] = useState<CinemaDetail | null>(null);

  const fetchCinema = async (queryDate?: Date) => {
    try {
      const dateToUse = queryDate || new Date();
      const queryString = `?date=${dateToUse.toISOString().split("T")[0]}`;
      const res = (await userService.GET_CINEMA_BY_ID(
        id as string,
        queryString
      )) as { status: number; data: CinemaDetail };
      console.log("res", res);
      if (res.status === 200) {
        setCinemaData(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCinema();
    }
  }, [id]);

  const handleSelectDate = (date: Date) => {
    console.log("date", date);
    fetchCinema(date);
  };

  return (
    <NavAndFooter>
      <Image
        src={"/images/cover-cinema.png"}
        alt="Cinema Interior"
        fill
        className="hidden md:flex object-cover object-center w-full z-0 max-h-[583px] overflow-hidden"
      />
      <div className="flex-1 flex flex-col items-center box-border ">
        <div className="w-full max-w-[1200px] max-h-[400px] md:my-[43px] flex flex-col items-center z-20 bg-gray-gc1b/70 md:rounded-lg overflow-hidden">
          <div className="flex w-full mb-6 md:mb-0">
            <div className="flex flex-1 md:max-w-[274px] max-h-[400px] box-border overflow-hidden  object-cover object-center ">
              <Image
                src="/images/cinema.webp"
                alt="Cinema Interior"
                className="md:h-[400px]  min-w-[126px] md:w-full max-w-[274px] object-cover overflow-hidden "
                width={274}
                height={400}
              />
            </div>

            <div className="flex flex-col flex-1 w-full p-4 md:p-[60px]">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-6 line-clamp-1 ">
                {i18n.language === "en"
                  ? cinemaData?.name_en
                  : cinemaData?.name}
              </h1>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 rounded-full bg-gray-600 text-white text-sm font-medium">
                  Hearing assistance
                </span>
                <span className="px-4 py-2 rounded-full bg-gray-600 text-white text-sm font-medium">
                  Wheelchair access
                </span>
              </div>
              <div className=" md:block space-y-4 mt-4 hidden flex-1">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {i18n.language
                    ? cinemaData?.description_en
                    : cinemaData?.description}
                </p>
                {cinemaData?.opening_hours && (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {i18n.language === "en"
                      ? `Open : ${cinemaData?.opening_hours}`
                      : `เวลาเปิด - ปิด : ${RENDER_TIME_TH(cinemaData?.opening_hours)}`}
                  </p>
                )}
                {cinemaData?.transportation ? (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {i18n.language === "en"
                      ? `Transportation : ${cinemaData.transportation}`
                      : `การเดินทาง : ${cinemaData.transportation}`}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          <div className=" md:hidden p-4 flex flex-1 flex-col  w-full ">
            <p className="text-gray-300 text-sm leading-relaxed">
              {i18n.language
                ? cinemaData?.description_en
                : cinemaData?.description}
            </p>
            {cinemaData?.opening_hours && (
              <p className="text-gray-300 text-sm leading-relaxed">
                {i18n.language === "en"
                  ? `Open : ${cinemaData?.opening_hours}`
                  : `เวลาเปิด - ปิด : ${RENDER_TIME_TH(cinemaData?.opening_hours)}`}
              </p>
            )}
            {cinemaData?.transportation ? (
              <p className="text-gray-300 text-sm leading-relaxed">
                {i18n.language === "en"
                  ? `Transportation : ${cinemaData.transportation}`
                  : `การเดินทาง : ${cinemaData.transportation}`}
              </p>
            ) : null}
          </div>
        </div>

        <section className="w-full z-10">
          <DateSelectionBarWidget
            onSelectDate={(date: Date) => handleSelectDate(date)}
          />
        </section>

        <section className="w-full max-w-[1200px] px-4 sm:px-0 space-y-6">
          {cinemaData?.showtimesByDay?.[0]?.halls.map((hall) =>
            hall.showtimes.map((showtime) => (
              <div
                key={showtime.id}
                className="bg-gray-gc1b rounded-lg p-6 shadow-lg flex gap-4"
              >
                <div className="w-[120px] h-[180px] relative flex-shrink-0">
                  <Image
                    src={showtime.movie.poster_url}
                    alt={showtime.movie.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-white text-xl font-bold">
                      {showtime.movie.title}
                    </h2>
                    <p className="text-gray-300 text-sm">
                      {showtime.movie.description}
                    </p>
                    <p className="text-gray-300 text-sm mt-2">
                      {i18n.language === "en"
                        ? `Hall: ${hall.name}`
                        : `โรง: ${hall.name}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">
                      {showtime.time_slot.start_time} -{" "}
                      {showtime.time_slot.end_time}
                    </span>
                    <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">
                      {showtime.price} บาท
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="w-full max-w-[1200px] px-4 sm:px-0">
          <div className="space-y-6">
            {/* Movie 1 - Django Unchained */}
            <div className="bg-gray-gc1b rounded-lg p-6 shadow-lg">
              <ShowtimeMovie
                movie={{
                  id: "movie1",
                  title: "Django Unchained",
                  poster: movie1Poster,
                  genreTags: ["Comedy", "Drama"],
                  languageTag: "EN",
                  movieDetailLink: "#",
                }}
                showtimes={{
                  groups: [
                    {
                      hallId: "h1",
                      hallLabel: "Hall 1",
                      times: [
                        { id: "t11", label: "11:30", disabled: true },
                        { id: "t12", label: "14:30" },
                        { id: "t13", label: "16:30" },
                      ],
                    },
                    {
                      hallId: "h3",
                      hallLabel: "Hall 3",
                      times: [
                        { id: "t31", label: "09:00", disabled: true },
                        { id: "t32", label: "12:00", disabled: true },
                        { id: "t33", label: "15:00" },
                        { id: "t34", label: "18:00" },
                      ],
                    },
                    {
                      hallId: "h6",
                      hallLabel: "Hall 6",
                      times: [
                        { id: "t61", label: "13:30" },
                        { id: "t62", label: "18:00" },
                        { id: "t63", label: "21:00" },
                      ],
                    },
                  ],
                }}
              />
            </div>

            {/* Movie 2 - The Dark Knight */}
            <div className="bg-gray-gc1b rounded-lg p-6 shadow-lg">
              <ShowtimeMovie
                movie={{
                  id: "movie2",
                  title: "The Dark Knight",
                  poster: movie2Poster,
                  genreTags: ["Action", "Crime"],
                  languageTag: "TH",
                  movieDetailLink: "#",
                }}
                showtimes={{
                  groups: [
                    {
                      hallId: "h2",
                      hallLabel: "Hall 2",
                      times: [
                        { id: "t21", label: "11:30", disabled: true },
                        { id: "t22", label: "14:30" },
                        { id: "t23", label: "16:30" },
                        { id: "t24", label: "20:30" },
                        { id: "t25", label: "23:30" },
                      ],
                    },
                    {
                      hallId: "h4",
                      hallLabel: "Hall 4",
                      times: [
                        { id: "t41", label: "15:00" },
                        { id: "t42", label: "18:00" },
                        { id: "t43", label: "21:00" },
                      ],
                    },
                  ],
                }}
              />
            </div>

            {/* Movie 3 - Interstella */}
            <div className="bg-gray-gc1b rounded-lg p-6 shadow-lg">
              <ShowtimeMovie
                movie={{
                  id: "movie3",
                  title: "Interstella",
                  poster: movie3Poster,
                  genreTags: ["Sci-fi"],
                  languageTag: "TH/EN",
                  movieDetailLink: "#",
                }}
                showtimes={{
                  groups: [
                    {
                      hallId: "h5",
                      hallLabel: "Hall 5",
                      times: [
                        { id: "t51", label: "14:30" },
                        { id: "t52", label: "16:30" },
                        { id: "t53", label: "20:30" },
                        { id: "t54", label: "23:30" },
                      ],
                    },
                    {
                      hallId: "h7",
                      hallLabel: "Hall 7",
                      times: [
                        { id: "t71", label: "15:00" },
                        { id: "t72", label: "18:00" },
                        { id: "t73", label: "21:00" },
                      ],
                    },
                  ],
                }}
              />
            </div>

            {/* Movie 4 - Dune: Part Two */}
            <div className="bg-gray-gc1b rounded-lg p-6 shadow-lg">
              <ShowtimeMovie
                movie={{
                  id: "movie4",
                  title: "Dune: Part Two",
                  poster: movie4Poster,
                  genreTags: ["Action", "Sci-fi"],
                  languageTag: "TH",
                  movieDetailLink: "#",
                }}
                showtimes={{
                  groups: [
                    {
                      hallId: "h8",
                      hallLabel: "Hall 8",
                      times: [
                        { id: "t81", label: "14:30" },
                        { id: "t82", label: "16:30" },
                        { id: "t83", label: "20:30" },
                        { id: "t84", label: "23:30" },
                      ],
                    },
                    {
                      hallId: "h9",
                      hallLabel: "Hall 9",
                      times: [
                        { id: "t91", label: "15:00" },
                        { id: "t92", label: "18:00" },
                        { id: "t93", label: "21:00" },
                      ],
                    },
                  ],
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </NavAndFooter>
  );
};

export default CinemaDetallWidget;
