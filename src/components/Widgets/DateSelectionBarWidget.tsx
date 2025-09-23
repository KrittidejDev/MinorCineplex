import DateSelection from "../ui/dateselection";
import ExpandRightLight from "../Icons/ExpandRightLight";
import { useState } from "react";

function DateSelectionBarWidget() {
  const [activeDate, setActiveDate] = useState<number | null>(0);

  return (
    <div className="w-screen h-fit bg-gray-gc1b flex justify-center items-center lg:mt-12">
      <div className="flex items-center gap-2 py-4 overflow-x-auto hide-scrollbar justify-start lg:justify-center flex-nowrap">
        <DateSelection
          className="flex-shrink-0"
          day="Today"
          date="24 Jun 2024"
          isActive={activeDate === 0}
          onSelect={() => setActiveDate(0)}
        />
        <DateSelection
          className="flex-shrink-0"
          day="Tue"
          date="25 Jun 2024"
          isActive={activeDate === 1}
          onSelect={() => setActiveDate(1)}
        />
        <DateSelection
          className="flex-shrink-0"
          day="Wed"
          date="26 Jun 2024"
          isActive={activeDate === 2}
          onSelect={() => setActiveDate(2)}
        />
        <DateSelection
          className="flex-shrink-0"
          day="Thu"
          date="27 Jun 2024"
          isActive={activeDate === 3}
          onSelect={() => setActiveDate(3)}
        />
        <DateSelection
          className="flex-shrink-0"
          day="Fri"
          date="28 Jun 2024"
          isActive={activeDate === 4}
          onSelect={() => setActiveDate(4)}
        />
        <DateSelection
          className="flex-shrink-0"
          day="Sat"
          date="29 Jun 2024"
          isActive={activeDate === 5}
          onSelect={() => setActiveDate(5)}
        />

        <button className="flex-shrink-0 cursor-pointer">
          <ExpandRightLight width={40} height={40} color="#C8CEDD" />
        </button>
      </div>
    </div>
  );
}

export default DateSelectionBarWidget;
