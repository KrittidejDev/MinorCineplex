import { CinemaByProvince } from "@/types/cinema";
import CinemaCard from "../Cards/CinemaCard";
import DoneRound from "../Icons/DoneRound";
import { useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

interface CinemaLocationProps {
  data: CinemaByProvince[];
  filterCinema: (filter: string) => void;
}

const CinemaLocation = ({ filterCinema, data }: CinemaLocationProps) => {
  const { i18n} = useTranslation();
  const [filter, setFilter] = useState<string>("1");
  const [visibleProvinces, setVisibleProvinces] = useState<number>(1);

  const texts = useMemo(() => ({
    allCinemas: i18n.language === "th" ? "โรงภาพยนตร์ทั้งหมด" : "All Cinemas",
    browseByCity: i18n.language === "th" ? "เรียกดูตามเมือง" : "Browse by City",
    nearestLocationFirst: i18n.language === "th" ? "ตำแหน่งใกล้ที่สุดก่อน" : "Nearest Location First",
  }), [i18n.language]);

  const _handleClickFilter = (e: string) => {
    setFilter(e);
    filterCinema(e);
    setVisibleProvinces(1);
  };

  const filterBtnStyle =
    "bg-gray-g63f h-11 py-2 px-4 rounded-sm flex items-center";
  const filterActiveStyle =
    "bg-gray-gf7e h-11 py-1 px-4 rounded-sm flex items-center";

  const displayedProvinces = data
    ?.filter((item) => item.provinceEn !== "Other")
    .slice(0, visibleProvinces);

  const fetchMoreProvinces = () => {
    if (visibleProvinces < data.length) {
      setVisibleProvinces((prev) => prev + 1);
    }
  };

  return (
    <div className="flex w-screen justify-center">
      <section className="flex w-full max-w-[1440px] flex-col gap-10 justify-center py-10 sm:py-20 px-4 xl:px-30">
        <header className="flex gap-5 flex-wrap justify-between">
          <h1 className="text-white text-4xl">{texts.allCinemas}</h1>
          <div className="flex gap-3 justify-between items-center p-1 h-12 rounded-sm bg-gray-g63f">
            <button
              className={`${filter === "1" ? filterActiveStyle : filterBtnStyle} cursor-pointer`}
              onClick={() => _handleClickFilter("1")}
            >
              {filter === "1" && <DoneRound height="30" width="30" />}
              <p className="text-gray-gedd line-clamp-1">{texts.browseByCity}</p>
            </button>
            <button
              className={`${filter === "2" ? filterActiveStyle : filterBtnStyle} cursor-pointer`}
              onClick={() => _handleClickFilter("2")}
            >
              {filter === "2" && <DoneRound height="30" width="30" />}
              <p className="text-gray-gedd line-clamp-1">
                {texts.nearestLocationFirst}
              </p>
            </button>
          </div>
        </header>
        <InfiniteScroll
          dataLength={displayedProvinces.length}
          next={fetchMoreProvinces}
          hasMore={visibleProvinces < data.length}
          loader={<p className="text-gray-g3b0 text-center"></p>}
          endMessage={<p className="text-gray-g3b0 text-center"></p>}
        >
          <section className="flex flex-col gap-10">
            {displayedProvinces.map((e) => (
              <section
                className="flex flex-col gap-6"
                key={e.provinceEn ?? e.provinceTh ?? Math.random()}
              >
                <h2 className="text-gray-g3b0 text-2xl font-bold">
                  {i18n.language === "en" ? e.provinceEn : e.provinceTh}
                </h2>
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                  {e.cinemas.map((cinema) => (
                    <CinemaCard
                      cinema={cinema}
                      key={cinema.id}
                      filter={filter}
                    />
                  ))}
                </div>
              </section>
            ))}
          </section>
        </InfiniteScroll>
      </section>
    </div>
  );
};

export default CinemaLocation;
