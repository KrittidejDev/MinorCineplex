import React, { useEffect, useState, useCallback } from "react";
import ShowtimeMovie, { ShowtimeMovieDataProps } from "./ShowtimeMovie";
import DateSelectionBarWidget from "./DateSelectionBarWidget";
import Image from "next/image";
import NavAndFooter from "../MainLayout/NavAndFooter";
import { useParams } from "next/navigation";
import { userService } from "@/config/userServices";
import { CinemaDetail, ShowtimeMovieData } from "@/types/cinema";
import { useTranslation } from "react-i18next";
import { RENDER_TIME_TH } from "@/lib/utils/dateTimeFormat";
import { HoverCard3D } from "../Displays/HoverCard3D";

const CinemaDetallWidget: React.FC = () => {
  const { i18n } = useTranslation();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [cinemaData, setCinemaData] = useState<CinemaDetail | null>(null);

  const fetchCinema = useCallback(
    async (queryDate?: Date) => {
      if (!id) return;

      try {
        const dateToUse = queryDate || new Date();
        const queryString = `?date=${dateToUse.toISOString().split("T")[0]}`;
        const res = (await userService.GET_CINEMA_BY_ID(id, queryString)) as {
          status: number;
          data: CinemaDetail;
        };

        if (res.status === 200) {
          setCinemaData(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchCinema();
  }, [fetchCinema]);

  const handleSelectDate = (date: Date) => {
    fetchCinema(date);
  };
  return (
    <NavAndFooter>
      <Image
        src="/images/cover-cinema.png"
        alt="Cinema Interior"
        fill
        className="hidden md:flex object-cover object-center w-full z-0 max-h-[583px] overflow-hidden"
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
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
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
              <div className="md:block space-y-4 mt-4 hidden flex-1">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {i18n.language
                    ? cinemaData?.description_en
                    : cinemaData?.description}
                </p>
                {cinemaData?.opening_hours && (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {i18n.language === "en"
                      ? `Open : ${cinemaData.opening_hours}`
                      : `เวลาเปิด - ปิด : ${RENDER_TIME_TH(
                          cinemaData.opening_hours
                        )}`}
                  </p>
                )}
                {cinemaData?.transportation && (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {i18n.language === "en"
                      ? `Transportation : ${cinemaData.transportation}`
                      : `การเดินทาง : ${cinemaData.transportation}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden p-4 flex flex-1 flex-col w-full">
            <p className="text-gray-300 text-sm leading-relaxed">
              {i18n.language
                ? cinemaData?.description_en
                : cinemaData?.description}
            </p>
            {cinemaData?.opening_hours && (
              <p className="text-gray-300 text-sm leading-relaxed">
                {i18n.language === "en"
                  ? `Open : ${cinemaData.opening_hours}`
                  : `เวลาเปิด - ปิด : ${RENDER_TIME_TH(
                      cinemaData.opening_hours
                    )}`}
              </p>
            )}
            {cinemaData?.transportation && (
              <p className="text-gray-300 text-sm leading-relaxed">
                {i18n.language === "en"
                  ? `Transportation : ${cinemaData.transportation}`
                  : `การเดินทาง : ${cinemaData.transportation}`}
              </p>
            )}
          </div>
        </div>
        <section className="w-dvw z-1">
          <DateSelectionBarWidget onSelectDate={handleSelectDate} />
        </section>
        <section className="w-dvw py-4 sm:px-0">
          <div className="space-y-6 py-10 md:py-20">
            {cinemaData?.movies?.map((movie: ShowtimeMovieData) => (
              <div key={movie.id}>
                <ShowtimeMovie data={movie as ShowtimeMovieDataProps} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </NavAndFooter>
  );
};

export default CinemaDetallWidget;
