import React, { useState } from "react";
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
    groups: ShowtimeGroup[];
    onChange?: (time: Showtime | null, context: { hallId: string }) => void;
    className?: string;
    locationLabel?: string;
    badges?: string[];
}

export const ShowTime: React.FC<ShowtimeByHall> = ({ groups, onChange, className, locationLabel, badges }) => {
    const [selectedByHall, setSelectedByHall] = useState<Record<string, string | null>>({});
    const [collapsedByHall, setCollapsedByHall] = useState<Record<string, boolean>>({});

    const handleSelect = (hallId: string, time: Showtime) => {
        if (time.disabled) return;
        setSelectedByHall((prev) => {
            const current = prev[hallId] ?? null;
            const nextId = current === time.id ? null : time.id;
            return { ...prev, [hallId]: nextId };
        });
        onChange?.(time, { hallId });
    };

    const toggleHall = (hallId: string) => {
        setCollapsedByHall((prev) => ({ ...prev, [hallId]: !prev[hallId] }));
    };

    return (
        <div className={`flex flex-col gap-8 ${className ?? ""}`}>
            {(locationLabel || (badges && badges.length > 0)) && (
                <div className="w-full">
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3 text-white/90">
                            <LocationIconBlue />
                            <span className="font-semibold">{locationLabel}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex flex-wrap gap-2">
                                {(badges ?? []).map((b) => (
                                    <span
                                        key={b}
                                        className="px-3 py-1 rounded-full bg-gray-gc1b border border-gray-g63f text-white/80 text-sm"
                                    >
                                        {b}
                                    </span>
                                ))}
                            </div>
                            <button type="button" aria-label="More options" className="w-8 h-8 rounded-full border border-gray-g63f text-white/80 grid place-items-center hover:brightness-110">
                                <ExpandDownLight width={16} height={16} />
                            </button>
                        </div>
                    </div>
                    <div className="h-px w-full bg-gray-g63f/60 mt-2" />
                </div>
            )}
            {groups.map((group) => (
                <div key={group.hallId} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="text-white/90 font-semibold">{group.hallLabel}</div>
                        <button
                            type="button"
                            className="w-8 h-8 rounded-md border border-gray-g63f text-white/80 grid place-items-center hover:brightness-110"
                            aria-expanded={!collapsedByHall[group.hallId]}
                            aria-controls={`hall-${group.hallId}`}
                            onClick={() => toggleHall(group.hallId)}
                        >
                            <span className={`${collapsedByHall[group.hallId] ? "rotate-180" : ""} transition-transform`}>
                                <ExpandDownLight width={16} height={16} />
                            </span>
                        </button>
                    </div>
                    {!collapsedByHall[group.hallId] && (
                        <div id={`hall-${group.hallId}`} className="flex flex-wrap gap-3 sm:gap-4 md:gap-6">
                            {group.times.map((time) => {
                                const isSelected = (selectedByHall[group.hallId] ?? null) === time.id;
                                const base =
                                    "rounded-[8px] px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 flex items-center justify-center text-fm-16 font-semibold transition-colors";
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
                    )}
                </div>
            ))}
        </div>
    );
};

export default ShowTime;


