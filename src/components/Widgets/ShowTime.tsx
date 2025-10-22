import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LocationIconBlue from "@/components/Icons/LocationIconBlue";
import ExpandDownLight from "@/components/Icons/ExpandDownLight";
import {
  RUNDER_TIMESLOT,
  ShowtimeButtonProps,
} from "@/lib/utils/showtimeUtils";
import { ShowtimeDTO } from "@/types/movie"; // import type ShowtimeDTO

export type Showtime = {
  id: string;
  date: Date;
  time_slot: {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
  };
  price?: number;
  available_seats?: number;
  total_seats?: number;
};

export interface ShowTimeProps {
  data?: ShowtimeDTO;
  onChange?: (time: Showtime, context: { hallId: string }) => void;
  className?: string;
  badges?: string[];
  collapsed?: boolean;
  autoNavigate?: boolean;
}

export const ShowTime: React.FC<ShowTimeProps> = ({
  data,
  className,
  badges,
  collapsed,
  autoNavigate = true,
}) => {
  const router = useRouter();
  const [allCollapsedInternal, setAllCollapsedInternal] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const allCollapsed =
    typeof collapsed === "boolean" ? collapsed : allCollapsedInternal;

  const handleSelect = (hall_slug: string, time: Showtime) => {
    const { disabled } = RUNDER_TIMESLOT(
      time.time_slot.start_time,
      time.time_slot.end_time,
      time.date
    );

    const newSlug = `${data?.slug}-${hall_slug}`;
    if (disabled) return;
    if (autoNavigate && time.id) {
      router.push(`/booking/${newSlug}?id=${time.id}`);
    }
  };

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
      {data?.cinema && (
        <div className="w-full">
          <div className="flex items-center justify-between py-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 text-white/90">
              <div className="flex items-center gap-3">
                <LocationIconBlue />
                <span className="font-semibold line-clamp-1">
                  {data.cinema.name}
                </span>
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
        {data?.halls?.map(({ hall, showtimes }) => (
          <div key={hall.id} className="flex flex-col px-1 md:px-4 py-6 gap-4">
            <div className="text-white/90 font-semibold text-f-24">
              {hall.name}
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 w-full justify-start">
              {showtimes
                .slice()
                .sort((a, b) => {
                  const [hourA, minA] = a.time_slot.start_time
                    .split(":")
                    .map(Number);
                  const [hourB, minB] = b.time_slot.start_time
                    .split(":")
                    .map(Number);
                  return hourA * 60 + minA - (hourB * 60 + minB);
                })
                .map((time) => {
                  const {
                    disabled,
                    className: timeClassName,
                  }: ShowtimeButtonProps = RUNDER_TIMESLOT(
                    time.time_slot.start_time,
                    time.time_slot.end_time,
                    time.date
                  );

                  return (
                    <button
                      key={time.id}
                      type="button"
                      disabled={disabled}
                      className={`${base} ${timeClassName}`}
                      onClick={() => handleSelect(hall.slug, time)}
                    >
                      {time.time_slot.name}
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
