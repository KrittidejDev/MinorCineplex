import { useTranslation } from "react-i18next";
import LocationIconBlue from "../Icons/LocationIconBlue";
import Link from "next/link";
import { CinemaDTO } from "@/types/cinema"; // เปลี่ยนจาก CinemaType เป็น CinemaWithDistance

type CinemaCardProps = {
  filter: string;
  cinema: CinemaDTO; // เปลี่ยนจาก CinemaType เป็น CinemaWithDistance
};

const CinemaCard = ({ filter, cinema }: CinemaCardProps) => {
  const { i18n } = useTranslation();

  const distanceText =
    i18n.language === "en" ? cinema?.distance_text : cinema?.distance_text_th;

  return (
    <Link href={`/cinemas/${cinema.slug}`} className="block">
      <div className="w-full max-w-[590px] border border-gray-g63f p-4 rounded-sm hover:border-gray-gf7e transition-colors cursor-pointer">
        <div className="flex gap-4 items-center">
          <div className="size-[52px]">
            <LocationIconBlue />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-white text-2xl font-bold line-clamp-1">
              {cinema.name}
            </h3>
            <p className="text-gray-g3b0 line-clamp-1">
              {filter === "2" && (
                <span className="text-white-wfff pr-2 mr-2 text-fr-16 border-r-2 border-r-gray-gf7e">
                  {distanceText}
                </span>
              )}
              {cinema.address}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CinemaCard;
