import Image from "next/image";
import StarFill from "../Icons/StarFill";

function ReviewCard() {
  return (
    <>
      <div className="w-[794px] h-[116px]">
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="relative w-11 h-11 rounded-full overflow-hidden">
              <Image
                src="https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg"
                alt="test"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <p className="font-bold text-[16px] text-gray-gedd">
                Jue Parinthon
              </p>
              <p className="text-sm text-gray-g3b0">24 Jun 2024</p>
            </div>
            <div className="flex ml-auto">
              <StarFill width={20} height={20} color={"#4E7BEE"} />
              <StarFill width={20} height={20} color={"#4E7BEE"} />
              <StarFill width={20} height={20} color={"#4E7BEE"} />
              <StarFill width={20} height={20} color={"#4E7BEE"} />
              <StarFill width={20} height={20} color={"#4E7BEE"} />
            </div>
          </div>
          <p className="text-gray-g3b0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Id
            voluptatum distinctio fuga corrupti labore reprehenderit unde
            laboriosam pariatur cupiditate? Quas, harum.
          </p>
        </div>
      </div>
    </>
  );
}

export default ReviewCard;
