import React, { useEffect, useRef, useState } from "react";
import LocationIconBlue from "@/components/Icons/LocationIconBlue";
import ExpandDownLight from "@/components/Icons/ExpandDownLight";

export type Showtime = {
  id: string;
  label: string;
  disabled?: boolean;
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
}

export const ShowTime: React.FC<ShowtimeByHall> = ({
  groups: propGroups,
  onChange: propOnChange,
  className,
  cinemaName,
  badges: propBadges,
  collapsed: propCollapsed,
}) => {
  const [selectedByHall, setSelectedByHall] = useState<
    Record<string, string | null>
  >({});
  const [allCollapsedInternal, setAllCollapsedInternal] =
    useState<boolean>(false);
  const listRef = useRef<HTMLDivElement>(null);
  const groups = propGroups;

  const onChange =
    propOnChange ||
    ((time, context) => {
      console.log("Selected time:", time, "Hall:", context.hallId);
    });
  const badges = propBadges;
  const collapsed = propCollapsed;

  const allCollapsed =
    typeof collapsed === "boolean" ? collapsed : allCollapsedInternal;

  const handleSelect = (hallId: string, time: Showtime) => {
    if (time.disabled) return;
    setSelectedByHall((prev) => {
      const current = prev[hallId] ?? null;
      const nextId = current === time.id ? null : time.id;
      return { ...prev, [hallId]: nextId };
    });
    onChange?.(time, { hallId });
  };

  // When expanding all, scroll the list into view
  const prevAllRef = useRef<boolean>(allCollapsed);
  useEffect(() => {
    if (prevAllRef.current && !allCollapsed && listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    prevAllRef.current = allCollapsed;
  }, [allCollapsed]);

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
            <div className="text-white/90 font-semibold">{group.hallLabel}</div>
            <div
              id={`hall-${group.hallId}`}
              className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 w-full justify-start"
            >
              {group.times.map((time) => {
                const isSelected =
                  (selectedByHall[group.hallId] ?? null) === time.id;
                const base =
                  "min-w-[96px] sm:min-w-[112px] rounded-[8px] px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 flex items-center justify-center text-fm-16 font-semibold transition-colors";
                const stateClass = time.disabled
                  ? "bg-gray-gc1b text-gray-gf7e/70 border border-gray-g63f cursor-not-allowed"
                  : isSelected
                    ? "bg-blue-bbee text-white"
                    : "bg-blue-b9a8 text-white hover:brightness-110";
                return (
                  <button
                    key={`${group.hallId}-${time.id}`}
                    type="button"
                    className={`${base} ${stateClass}`}
                    onClick={() => handleSelect(group.hallId, time)}
                    aria-pressed={isSelected}
                    disabled={time.disabled}
                  >
                    {time.label}
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
