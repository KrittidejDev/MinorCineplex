import StarFill from "../Icons/StarFill";
import Tag from "../Widgets/Tag";
import Image from "next/image";
import { HoverCard3D } from "../Displays/HoverCard3D";

interface MovieCardProps {
  id: string;
  title: string;
  poster_url?: string;
  release_date?: Date;
  rating?: string;
  genres: (
    | {
        genre: {
          id: string;
          name: string;
          slug: string;
          translations?: { en?: { name: string }; th?: { name: string } };
        };
      }
    | { language: { id: string; name: string; code: string } }
  )[];
}

function MovieCard({
  title,
  poster_url,
  release_date,
  rating,
  genres,
}: MovieCardProps) {
  return (
    <div className="w-[161px] h-fit md:w-[285px] md:h-[526px] md:mb-12 lg:mb-17 flex flex-col z-10">
      <HoverCard3D>
        <div
          className="relative"
          style={{
            aspectRatio: "2 / 3",
          }}
        >
          <Image
            src={poster_url || "/fallback-poster.jpg"}
            alt={title}
            fill
            sizes="(max-width: 768px) 161px, 285px"
            className="rounded-sm object-cover "
          />
        </div>
      </HoverCard3D>
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
              <StarFill width={16} height={16} color={"#4E7BEE"} />
            </div>
            <p className="font-medium fr-14 text-gray-g3b0">{!rating || rating === "0" ? "-" : rating}</p>
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-between">
          <h4 className="font-bold text-xl line-clamp-2 min-h-[56px]">
            {title}
          </h4>
          <div className="flex flex-wrap gap-2 mt-4">
            {genres?.map((g, i) => {
              let tagName = "";
              let variant: "genre" | "language" = "genre";

              if ("genre" in g && g.genre) {
                tagName =
                  g.genre.translations?.en?.name ||
                  g.genre.name ||
                  "Unknown Genre";
                variant = "genre";
              } else if ("language" in g && g.language) {
                tagName =
                  g.language.name || g.language.code || "Unknown Language";
                variant = "language";
              }

              return (
                <div key={i}>
                  <Tag name={tagName} variant={variant} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
