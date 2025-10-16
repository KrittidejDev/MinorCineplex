import React from "react";
import Tag from "@/components/Widgets/Tag";
import ShowtimeSelection, {
  Showtime,
} from "@/components/Widgets/ShowtimeSelection";
import Image from "next/image";
import Link from "next/link";
import { HoverCard3D } from "../Displays/HoverCard3D";

interface Hall {
  id: string;
  name: string;
  timeslots?: Showtime[];
}

export interface ShowtimeMovieDataProps {
  id: string;
  title: string;
  duration_min: number;
  description: string;
  poster_url?: string;
  genre?: string;
  halls?: Hall[];
}

interface ShowtimeMovieProps {
  data: ShowtimeMovieDataProps;
}

export const ShowtimeMovie: React.FC<ShowtimeMovieProps> = ({ data }) => {
  const genres = data?.genre?.split(",").map((g) => g.trim());

  return (
    <div className="bg-gray-gc1b rounded-lg shadow-lg flex flex-col md:flex-row h-fit max-w-[1200px] mx-auto">
      <div className="box-border flex md:flex-col p-6">
        <div className="flex gap-x-6">
          <HoverCard3D>
            <Image
              src={data?.poster_url || ""}
              alt={data?.title}
              className="h-[254px] w-full max-w-[174px] object-cover overflow-hidden rounded-lg"
              width={274}
              height={400}
            />
          </HoverCard3D>
          <div className="w-[174px] box-border">
            <div className="text-f-20 line-clamp-2 mb-2">{data?.title}</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {genres?.map((genre, i) => (
                <Tag key={i} name={genre} variant="genre" />
              ))}
            </div>
            <div className="font-bold text-fr-16 mt-6">
              <Link
                href={`/movies/${data?.id}/movie-info`}
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
          {data?.halls?.map((hall) => (
            <div key={hall?.id}>
              <div className="text-f-24 mb-4">{hall?.name}</div>
              <ShowtimeSelection timeslot={hall?.timeslots} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowtimeMovie;
