import LocationIconBlue from "../Icons/LocationIconBlue";
import Link from "next/link";

type Cinema = {
  name: string;
  address: string;
};

type CinemaCardProps = {
  cinema: Cinema;
};
const CinemaCard = ({ cinema }: CinemaCardProps) => {
  return (
    <Link href="/cinemas" className="block">
      <div className="w-full max-w-[590px] border border-gray-g63f p-4 rounded-sm hover:border-gray-gf7e transition-colors cursor-pointer">
        <div className="flex gap-4 items-center">
          <LocationIconBlue />
          <div className="flex flex-col gap-1">
            <h3 className="text-white text-2xl font-bold">{cinema.name}</h3>
            <p className="text-gray-g3b0 line-clamp-1">{cinema.address}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CinemaCard;
