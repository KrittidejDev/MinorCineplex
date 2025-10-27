import React from "react";
import Tag from "@/components/Widgets/Tag";
import ShowtimeSelection from "@/components/Widgets/ShowtimeSelection";
import Image from "next/image";
import Link from "next/link";
import { HoverCard3D } from "../Displays/HoverCard3D";
import { i18n } from "next-i18next";
import { MovieDTO, HallWithShowtimes } from "@/types/cinema";

interface ShowtimeMovieDataProps {
  movie: MovieDTO;
  halls?: HallWithShowtimes[];
}

interface ShowtimeMovieProps {
  data: ShowtimeMovieDataProps;
}

export const ShowtimeMovie: React.FC<ShowtimeMovieProps> = ({ data }) => {
  return (
    <div className="bg-gray-gc1b rounded-lg shadow-lg flex flex-col md:flex-row h-fit max-w-[1200px] mx-auto">
      <div className="box-border flex md:flex-col p-6">
        <div className="flex gap-x-6">
          <HoverCard3D>
            <Image
              src={data.movie.poster_url || ""}
              alt={data.movie.title}
              className="h-[254px] w-full max-w-[174px] object-cover overflow-hidden rounded-lg"
              width={274}
              height={400}
            />
          </HoverCard3D>
          <div className="w-[174px] box-border">
            <div className="text-f-20 line-clamp-2 mb-2">
              {i18n?.language === "en"
                ? data.movie.translations?.en?.title || data.movie.title
                : data.movie.translations?.th?.title || data.movie.title}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {data.movie.genres?.map((genre, i) => (
                <Tag
                  key={i}
                  name={
                    i18n?.language === "en"
                      ? genre.translations?.en?.name || genre.name
                      : genre.translations?.th?.name || genre.name
                  }
                  variant="genre"
                />
              ))}
            </div>
            <div className="font-bold text-fr-16 mt-6">
              <Link
                href={`/movies/${data.movie.slug}`}
                className="transparent-underline-normal"
              >
                Movie detail
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 px-10 py-5 md:py-10">
        <div className="flex flex-col flex-1 h-full overflow-y-auto gap-y-10 md:gap-y-15">
          {data.halls?.map((hall) => {
            const slug = [data.movie.slug, hall.slug]
              .join("-")
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9\-]/g, "");

            const showtimes = hall.showtimes.map((s) => ({
              id: s.id,
              date: s.date.toString(),
              showtime_id: s.id,
              start_time: s.timeslot.start_time,
              end_time: s.timeslot.end_time,
              slug,
            }));

            return (
              <div key={hall.id}>
                <div className="text-f-24 mb-4">{hall.name}</div>
                <ShowtimeSelection timeslot={showtimes} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShowtimeMovie;
