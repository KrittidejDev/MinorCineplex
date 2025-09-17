import StarFill from "../Icons/StarFill";

interface MovieCardProps {
        title: string;
        date: string;
        rating: number;
        genre1: string;
        genre2: string;
        lang: string;
    }

function MovieCard({title, date, rating, genre1, genre2, lang}: MovieCardProps) {

  return (
    <div className="w-[285px] h-[526px] flex flex-col cursor-pointer">
      <div className="h-[416px] bg-white rounded-[4px]">
        <img src="" alt={title} />
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between mt-4">
          <p className="text-sm text-[#8B93B0]">{date}</p>
          <div className="flex items-center gap-[2px]">
            <StarFill width={16} height={16} color={"#4E7BEE"} />
            <p className="font-medium text-sm text-[#8B93B0]">{rating}</p>
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-between">
          <h4 className="font-bold text-xl">{title}</h4>
          <div className="flex gap-2">
            <div className="py-[6px] px-[12px] bg-[#21263F] rounded-[4px]">
              <p className="text-[14px] text-[#8B93B0]">{genre1}</p>
            </div>
            <div className="py-[6px] px-[12px] bg-[#21263F] rounded-[4px]">
              <p className="text-[14px] text-[#8B93B0]">{genre2}</p>
            </div>
            <div className="py-[6px] px-[12px] bg-[#21263F] rounded-[4px]">
              <p className="text-[14px] text-[#C8CEDD]">{lang}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
