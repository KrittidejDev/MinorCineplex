import ShowtimeSelection from "../Widgets/ShowtimeSelection";
import ExpandDownLight from "../Icons/ExpandDownLight";
import LocationIconBlue from "../Icons/LocationIconBlue";
import Tag from "../Widgets/Tag";

interface TimeSelectionCardProps {
  cinemaName: string;
  halls: number[];
  tags?: string[];
}

function TimeSelectionCard({ cinemaName, halls, tags = [] }: TimeSelectionCardProps) {
  return (
    <div className="w-[1200px] bg-gray-gc1b flex flex-col rounded-md">

      <div className="flex justify-between py-4 px-6 border-b border-gray-g63f">
        <div className="flex items-center gap-5">
          <LocationIconBlue />
          <h3 className="text-f-24">{cinemaName}</h3>


          {tags.map((tag, index) => (
            <Tag key={index} name={tag} />
          ))}
        </div>
        <ExpandDownLight width={40} height={40} color={"#C8CEDD"} />
      </div>

      {halls.map((hallNum, index) => (
        <div
          key={hallNum}
          className={`px-6 ${index === 0 ? "mt-10" : "mt-15"} ${
            index === halls.length - 1 ? "mb-10" : ""
          }`}
        >
          <h3 className="text-f-24 text-gray-gedd mb-4">Hall {hallNum}</h3>
          <ShowtimeSelection />
        </div>
      ))}
    </div>
  );
}

export default TimeSelectionCard;
