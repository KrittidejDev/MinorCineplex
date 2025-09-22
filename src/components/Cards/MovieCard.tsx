import StarFill from "../Icons/StarFill";
import Tag from "../Widgets/Tag";
import Link from "next/link";

interface MovieCardProps {
  title: string;
  image: string;
  date: string;
  rating: number;
  genreTag1: string;
  genreTag2: string;
  langTag: string;
}

function MovieCard({
  title,
  image,
  date,
  rating,
  genreTag1,
  genreTag2,
  langTag,
}: MovieCardProps) {
  return (
    <div className="w-[161px] h-fit md:w-[285px] md:h-[526px] flex flex-col cursor-pointer">
      <Link href="/movies/1" passHref>
      <div className="h-[235px] md:h-[416px] bg-white-wfff">
        <img src={image} alt={title} className="rounded-sm" />
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between mt-4">
          <p className="fr-14 text-gray-g3b0">{date}</p>
          <div className="flex items-center gap-[2px]">
            <StarFill width={16} height={16} color={"#4E7BEE"} />
            <p className="font-medium fr-14 text-gray-g3b0">{rating}</p>
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-between">
          <h4 className="font-bold text-xl">{title}</h4>
          <div className="flex flex-wrap gap-2 mt-4">
            <Tag name={genreTag1} variant="genre" />
            <Tag name={genreTag2} variant="genre" />
            <Tag name={langTag} variant="language" />
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
}

export default MovieCard;
