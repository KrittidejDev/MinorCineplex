import StarFill from "../Icons/StarFill";
import Tag from "../Widgets/Tag";
import Image from "next/image";
import { HoverCard3D } from "../Displays/HoverCard3D";
import { useTranslation } from "next-i18next";

interface MovieCardProps {
  id: string;
  title: string;
  translations?: {
    th?: { title: string; description: string };
    en?: { title: string; description: string };
  };
  poster_url?: string;
  release_date?: Date;
  rating?: string;
  genres: (
    | {
        genre: {
          id: string;
          name: string;
          slug: string;
          translations?: { th?: { name: string }; en?: { name: string } };
        };
      }
    | { language: { id: string; name: string; code: string } }
  )[];
}

function MovieCard({
  title,
  translations,
  poster_url,
  release_date,
  rating,
  genres,
}: MovieCardProps) {
  const { i18n } = useTranslation();

  const displayTitle =
    i18n.language === "th"
      ? translations?.th?.title || title
      : translations?.en?.title || title;

  return (
    <div className="w-full max-w-[285px] h-fit mb-8 flex flex-col z-10 sm:max-w-[220px] md:max-w-[285px]">
      <HoverCard3D>
        <div className="relative w-full" style={{ aspectRatio: "2 / 3" }}>
          <Image
            src={poster_url || "/fallback-poster.jpg"}
            alt={displayTitle}
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
            <p className="font-medium fr-14 text-gray-g3b0">
              {!rating || rating === "0" ? "-" : rating}
            </p>
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-between">
          <h4 className="font-bold text-xl line-clamp-2 text-white min-h-[56px]">
            {displayTitle}
          </h4>
          <div className="flex flex-wrap gap-2 mt-4">
            {genres?.map((g, i) => {
              let tagName = "";
              let variant: "genre" | "language" = "genre";

              if ("genre" in g && g.genre) {
                tagName =
                  i18n.language === "th"
                    ? g.genre.translations?.th?.name ||
                      g.genre.name ||
                      "Unknown Genre"
                    : g.genre.translations?.en?.name ||
                      g.genre.name ||
                      "Unknown Genre";
                variant = "genre";
              } else if ("language" in g && g.language) {
                tagName =
                  g.language.code || g.language.name || "Unknown Language";
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
