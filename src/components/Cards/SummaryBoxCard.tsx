import Image from "next/image";
import Tag from "../Widgets/Tag";
import PinFill from "../Icons/PinFill";
import DateRangeFill from "../Icons/DateRangeFill";
import TimeFill from "../Icons/TimeFill";
import Shop from "../Icons/Shop";

function SummaryBoxCard() {
  return (
    <>
      <div className="w-[305px] h-[336px] bg-gray-gc1b rounded-lg">
        <div className="p-4">
          <p className="text-sm text-gray-g3b0 pb-3">
            Time remaining:{" "}
            <span className="text-sm text-blue-bbee pl-2">04:55</span>
          </p>
          <div className="flex gap-4 items-center">
            <Image
              src="https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg"
              alt="the_dark_knight"
              width={82.21}
              height={120}
              className="object-cover rounded-md"
            />
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-xl text-white-wfff">
                The Dark Knight
              </h4>
              <div className="flex gap-2">
                <Tag name="Action" variant="genre" />
                <Tag name="Crime" variant="genre" />
                <Tag name="TH" variant="language" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <div className="flex items-center gap-4">
              <PinFill width={16} height={16} color={"#565F7E"} />
              <p className="text-gray-gedd">Minor Cineplex Arkham</p>
            </div>
            <div className="flex items-center gap-4">
              <DateRangeFill width={16} height={16} color={"#565F7E"} />
              <p className="text-gray-gedd">24 Jun 2024</p>
            </div>
            <div className="flex items-center gap-4">
              <TimeFill width={16} height={16} color={"#565F7E"} />
              <p className="text-gray-gedd">16:30</p>
            </div>
            <div className="flex items-center gap-4">
              <Shop width={16} height={16} color={"#565F7E"} />
              <p className="text-gray-gedd">Hall 1</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SummaryBoxCard;
