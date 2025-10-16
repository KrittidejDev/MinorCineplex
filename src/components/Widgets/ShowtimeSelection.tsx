import {
  RUNDER_TIMESLOT,
  ShowtimeButtonProps,
} from "@/lib/utils/showtimeUtils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export interface Showtime {
  id: string;
  showtime_id?: string;
  start_time: string;
  end_time: string;
  label?: string;
}

interface ShowtimeSelectionProps {
  timeslot?: Showtime[];
}

export const ShowtimeSelection: React.FC<ShowtimeSelectionProps> = ({
  timeslot,
}) => {
  const router = useRouter();
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (ts: Showtime) => {
    router.push({
      pathname: `/booking/${ts?.showtime_id}`,
    });
  };

  const base =
    "w-full max-w-32 flex flex-col justify-center items-center py-3 px-[41px] rounded-lg transition-colors";

  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6">
      {timeslot
        ?.slice()
        .sort(
          (a, b) =>
            new Date(`1970-01-01T${a.start_time}`).getTime() -
            new Date(`1970-01-01T${b.start_time}`).getTime()
        )
        .map((e) => {
          const { disabled, className }: ShowtimeButtonProps = RUNDER_TIMESLOT(
            e.start_time,
            e.end_time,
            now
          );

          return (
            <button
              key={e.id}
              type="button"
              disabled={disabled}
              className={`${base} ${className}`}
              onClick={() => handleSelect(e)}
            >
              {e.start_time}
            </button>
          );
        })}
    </div>
  );
};

export default ShowtimeSelection;
