import StarFill from "../Icons/StarFill";
import Tag from "../Widgets/Tag";
import Image from "next/image";
import { HoverCard3D } from "../Displays/HoverCard3D";
import { useTranslation } from "next-i18next";

interface Movies {
  id?: string;
  title: string;
  translations?: {
    th?: { title: string; description: string };
    en?: { title: string; description: string };
  };
  poster_url?: string | null;
  release_date?: Date | null;
  rating?: string | null;
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

function MovieCardInfo({
  title,
  translations,
  poster_url,
  release_date,
  rating,
  genres,
}: Movies) {
  const { i18n } = useTranslation();
  
  // Get translated title based on current language
  const displayTitle = i18n.language === "th"
    ? translations?.th?.title || title
    : translations?.en?.title || title;
  
  return (
    <div className="w-full h-fit flex gap-5">
      <div className="w-full max-w-[345px]">
        <HoverCard3D>
          <div className="relative aspect-[2/3] w-full">
            {" "}
            <Image
              src={poster_url || "/fallback-poster.jpg"}
              alt={displayTitle}
              fill
              sizes="(max-width: 768px) 161px, 285px"
              className="rounded-sm object-cover"
            />
          </div>
        </HoverCard3D>
      </div>
      <div className="w-full">
        <h4 className="font-bold text-xl line-clamp-2 min-h-[56px]">{displayTitle}</h4>
        <div className="flex gap-2.5 mt-5">
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
            <StarFill width={16} height={16} color={"#4E7BEE"} />
            <p className="font-medium fr-14 text-gray-g3b0">{rating || "-"}</p>
          </div>
        </div>
        <div className="w-fit flex flex-wrap gap-2 mt-4">
          {genres?.map((g, i) => {
            let tagName = "";
            let variant: "genre" | "language" = "genre";

            if ("genre" in g && g.genre) {
              // Get translated genre name based on current language
              tagName = i18n.language === "th"
                ? g.genre.translations?.th?.name || g.genre.name || "Unknown Genre"
                : g.genre.translations?.en?.name || g.genre.name || "Unknown Genre";
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
  );
}

export default MovieCardInfo;
