import DateSelection from "../ui/dateselection";
import ExpandRightLight from "../Icons/ExpandRightLight";
import { useState } from "react";
import { format, addDays } from "date-fns";

function DateSelectionBarWidget() {
  const [activeDate, setActiveDate] = useState<number | null>(0);

  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <div className="w-screen h-fit bg-gray-gc1b flex justify-center items-center lg:mt-12">
      <div className="flex items-center gap-2 py-4 w-[80] overflow-x-auto hide-scrollbar justify-start lg:justify-center flex-nowrap">
        {next7Days.map((date, index) => (
          <DateSelection
            key={index}
            className="flex-shrink-0"
            day={index === 0 ? "Today" : format(date, "EEE")}
            date={format(date, "dd MMM yyyy")}
            isActive={activeDate === index}
            onSelect={() => setActiveDate(index)}
          />
        ))}

        <button className="flex-shrink-0 cursor-pointer">
          <ExpandRightLight width={40} height={40} color="#C8CEDD" />
        </button>
      </div>
    </div>
  );
}

export default DateSelectionBarWidget;
