import Tag from "../Widgets/Tag";
import { Button } from "../ui/button";
import Image from "next/image";

interface MoviesDetailWidgetProps {
  movie?: Movie;
}

interface Movie {
  id: string;
  title: string;
  duration_min: number;
  description?: string | null;
  poster_url?: string | null;
  trailer_url?: string | null;
  genre?: string | null;
  rating?: string | null;
  release_date?: string | null;
}

function MoviesDetailWidget({ movie }: MoviesDetailWidgetProps) {
  return (
    <>
      <div className="w-screen flex justify-start lg:justify-center lg:mt-[60px]">
        <div className="w-full lg:w-[1200px] lg:h-[600px] flex flex-col lg:flex-row px-1 md:px4">
          <div className="relative w-full h-[547px] lg:w-[411px] lg:h-[600px]">
            {movie?.poster_url && (
              <Image
                src={movie?.poster_url ?? ""}
                alt={movie?.title ?? ""}
                fill
                className="object-cover rounded-md"
              />
            )}
          </div>

          <div className="flex flex-col flex-1 py-10 px-4 lg:p-[60px] bg-gray-gc1b/70 backdrop-blur-xl rounded-md">
            <div className="flex flex-col gap-4">
              <h2 className="text-f-36 text-white-wfff">
                {movie?.title ?? ""}
              </h2>
              <div className="w-fit flex flex-col lg:flex-row lg:items-center">
                <div className="flex gap-2">
                  <div className="flex gap-2 border-r border-gray-gedd pr-2 lg:pr-5">
                    {movie?.genre
                      ? movie.genre
                          .split(",")
                          .map((g) => (
                            <Tag
                              key={g.trim()}
                              name={g.trim()}
                              variant="genre"
                            />
                          ))
                      : null}
                  </div>
                </div>
                <div className="pl-2 lg:pl-5 mt-2 lg:mt-0">
                  <p>
                    Release date:{" "}
                    {movie?.release_date
                      ? new Date(
                          String(movie.release_date)
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 mb-10 lg:my-12">
              <Button className="btn-base blue-normal">Movie detail</Button>
            </div>
            <p className="text-fr-16 text-gray-gedd">
              {movie?.description ?? ""}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MoviesDetailWidget;
