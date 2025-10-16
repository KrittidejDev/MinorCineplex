import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LocationIconBlue from "@/components/Icons/LocationIconBlue";
import ExpandDownLight from "@/components/Icons/ExpandDownLight";
import {
  RUNDER_TIMESLOT,
  ShowtimeButtonProps,
} from "@/lib/utils/showtimeUtils";

export type Showtime = {
  id: string; // showtime_id
  label: string; // start_time
  start_time: string;
  end_time: string;
  availableSeats?: number;
  totalSeats?: number;
};

export type ShowtimeGroup = {
  hallId: string;
  hallLabel: string;
  times: Showtime[];
};

interface ShowtimeByHall {
  groups?: ShowtimeGroup[];
  onChange?: (time: Showtime | null, context: { hallId: string }) => void;
  className?: string;
  cinemaName?: string;
  badges?: string[];
  collapsed?: boolean;
  autoNavigate?: boolean;
}

export const ShowTime: React.FC<ShowtimeByHall> = ({
  groups: propGroups,
  onChange: propOnChange,
  className,
  cinemaName,
  badges: propBadges,
  collapsed: propCollapsed,
  autoNavigate = true,
}) => {
  const router = useRouter();
  const [now, setNow] = useState<Date>(new Date());
  const [allCollapsedInternal, setAllCollapsedInternal] =
    useState<boolean>(false);
  const listRef = useRef<HTMLDivElement>(null);

  const groups = propGroups;
  const onChange = propOnChange;
  const badges = propBadges;
  const collapsed = propCollapsed;

  const allCollapsed =
    typeof collapsed === "boolean" ? collapsed : allCollapsedInternal;

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (hallId: string, time: Showtime) => {
    // ตรวจสอบว่า disabled หรือไม่
    const { disabled } = RUNDER_TIMESLOT(time.start_time, time.end_time, now);

    if (disabled) return;

    // Callback
    onChange?.(time, { hallId });

    // Auto navigate to booking page
    if (autoNavigate && time.id) {
      router.push(`/booking/${time.id}`);
    }
  };

  // When expanding all, scroll the list into view
  const prevAllRef = useRef<boolean>(allCollapsed);
  useEffect(() => {
    if (prevAllRef.current && !allCollapsed && listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    prevAllRef.current = allCollapsed;
  }, [allCollapsed]);

  const base =
    "w-full max-w-32 flex flex-col justify-center items-center py-3 px-[41px] rounded-lg transition-colors";

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      {cinemaName !== undefined && (
        <div className="w-full">
          <div className="flex items-center justify-between py-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 text-white/90">
              <div className="flex items-center gap-3">
                <LocationIconBlue />
                <span className="font-semibold line-clamp-1">{cinemaName}</span>
              </div>
              <div className="flex flex-wrap gap-2 md:ml-2">
                {(badges ?? []).map((b) => (
                  <span
                    key={b}
                    className="px-3 py-1 rounded-full bg-gray-gc1b border border-gray-g63f text-white/80 text-sm"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Toggle showtimes"
                className={`w-8 h-8 rounded-full border border-gray-g63f text-white/80 grid place-items-center hover:brightness-110 ${allCollapsed ? "rotate-180" : ""} transition-transform`}
                aria-expanded={!allCollapsed}
                onClick={() => setAllCollapsedInternal((p) => !p)}
              >
                <ExpandDownLight width={16} height={16} />
              </button>
            </div>
          </div>
          <div className="h-px w-full bg-gray-g63f/60 mt-2" />
        </div>
      )}

      <div
        ref={listRef}
        style={{
          overflow: "hidden",
          transition: "max-height 300ms ease",
          maxHeight: allCollapsed ? 0 : 2000,
        }}
      >
        {groups?.map((group) => (
          <div
            key={group.hallId}
            className="flex flex-col px-1 md:px-4 py-6 gap-4"
          >
            <div className="text-white/90 font-semibold text-f-24">
              {group.hallLabel}
            </div>
            <div
              id={`hall-${group.hallId}`}
              className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 w-full justify-start"
            >
              {group.times
                .slice()
                .sort(
                  (a, b) =>
                    new Date(`1970-01-01T${a.start_time}`).getTime() -
                    new Date(`1970-01-01T${b.start_time}`).getTime()
                )
                .map((time) => {
                  // ใช้ RUNDER_TIMESLOT เหมือน ShowtimeSelection
                  const {
                    disabled,
                    className: timeClassName,
                  }: ShowtimeButtonProps = RUNDER_TIMESLOT(
                    time.start_time,
                    time.end_time,
                    now
                  );

                  return (
                    <button
                      key={`${group.hallId}-${time.id}`}
                      type="button"
                      disabled={disabled}
                      className={`${base} ${timeClassName}`}
                      onClick={() => handleSelect(group.hallId, time)}
                    >
                      {time.start_time}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowTime;
