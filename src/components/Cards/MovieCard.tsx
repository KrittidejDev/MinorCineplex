import StarFill from "../Icons/StarFill";
import Tag from "../Widgets/Tag";
import Image from "next/image";
import { HoverCard3D } from "../Displays/HoverCard3D";

interface Movies {
  id: string;
  title: string;
  poster_url?: string | null;
  release_date?: Date | null;
  rating?: string | null;
  genre?: string | null;
}

function MovieCard({
  id,
  title,
  poster_url,
  release_date,
  rating,
  genre,
}: Movies) {
  const genres = genre ? genre.split(",").map((g) => g.trim()) : [];

  return (
    <div className="w-[161px] h-fit md:w-[285px] md:h-[526px] md:mb-12 lg:mb-17 flex flex-col">
        <div className="h-[235px] md:h-[416px] rounded-sm ">
          <HoverCard3D>
          <div className="relative h-[235px] md:h-[416px]">
            {" "}

            <Image
              src={poster_url || "/fallback-poster.jpg"}
              alt={title}
              fill
              sizes="(max-width: 768px) 161px, 285px"
              className="rounded-sm object-cover "
            />
          </div>
          </HoverCard3D>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between mt-4">
            <p className="fr-14 text-gray-g3b0">
              {release_date
                ? new Date(release_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </p>
            <div className="flex items-center gap-[2px]">
              <div className="text-blue-bbee">
                <StarFill width={16} height={16} />
              </div>
              <p className="font-medium fr-14 text-gray-g3b0">{rating || "-"}</p>
            </div>
          </div>
          <div className="flex flex-col flex-1 justify-between">
            <h4 className="font-bold text-xl line-clamp-2 min-h-[56px]">{title}</h4>
            <div className="flex flex-wrap gap-2 mt-4">
              {genres.map((g) => (
                <Tag key={g} name={g} variant="genre" />
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}

export default MovieCard;
