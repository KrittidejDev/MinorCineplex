import LocationIconBlue from "../Icons/LocationIconBlue";

type Cinema = {
  name: string;
  address: string;
};

type CinemaCardProps = {
  cinema: Cinema;
};
const CinemaCard = ({ cinema }: CinemaCardProps) => {
  return (
    <div className="w-full max-w-[590px] border border-gray-g63f p-4 rounded-sm">
      <div className="flex gap-4 items-center">
        <LocationIconBlue />
        <div className="flex flex-col gap-1">
          <h3 className="text-white text-2xl font-bold">{cinema.name}</h3>
          <p className="text-gray-g3b0 line-clamp-1">{cinema.address}</p>
        </div>
      </div>
    </div>
  );
};

export default CinemaCard;
