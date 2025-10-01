import DateSelection from "../ui/dateselection";
import { useState, useRef, useEffect } from "react";
import { format, addDays } from "date-fns";
import ExpandLeftLight from "../Icons/ExpandLeftLight";
import ExpandRightLight from "../Icons/ExpandRightLight";

interface DateSelectionBarWidgetProps {
  onSelectDate: (date: Date) => void;
}

function DateSelectionBarWidget({ onSelectDate }: DateSelectionBarWidgetProps) {
  const [activeDate, setActiveDate] = useState<number | null>(0);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const checkScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setShowPrev(el.scrollLeft > 0);
    setShowNext(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollBy = (offset: number) => {
    carouselRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="w-full h-fit bg-gray-gc1b flex justify-center items-center px-4 py-4">
      <div className="max-w-[1200px] relative w-full flex items-center gap-2 hide-scrollbar">
        {showPrev && (
          <button
            onClick={() => scrollBy(-200)}
            className="absolute left-0 z-10 bg-white/20 p-2 rounded-full shadow"
          >
            <ExpandLeftLight />
          </button>
        )}
        <div
          ref={carouselRef}
          className="flex gap-2 overflow-x-auto scroll-smooth flex-nowrap w-full"
        >
          {next7Days.map((date, index) => (
            <div key={index} className="flex-shrink-0 ">
              <DateSelection
                day={index === 0 ? "Today" : format(date, "EEE")}
                date={format(date, "dd MMM yyyy")}
                isActive={activeDate === index}
                onSelect={() => {
                  setActiveDate(index);
                  onSelectDate(date);
                }}
              />
            </div>
          ))}
        </div>
        {showNext && (
          <button
            onClick={() => scrollBy(200)}
            className="absolute right-0 z-10 bg-white/20 p-2 rounded-full shadow"
          >
            <ExpandRightLight />
          </button>
        )}
      </div>
    </div>
  );
}

export default DateSelectionBarWidget;
