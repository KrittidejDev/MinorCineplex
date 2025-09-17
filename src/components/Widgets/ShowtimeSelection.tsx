import { useState } from "react";

type Showtime = {
    id: string;
    label: string;
    disabled?: boolean;
};

interface ShowtimeSelection {
    times?: Showtime[];
    onChange?: (time: Showtime | null) => void;
    className?: string;
}

const defaultTimes: Showtime[] = [
    { id: "t1", label: "11:30", disabled: true },
    { id: "t2", label: "11:30" },
    { id: "t3", label: "11:30" },
];

export const ShowtimeSelection: React.FC<ShowtimeSelection> = ({
    times = defaultTimes,
    onChange,
    className,
}) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelect = (time: Showtime) => {
        if (time.disabled) return;
        const nextId = time.id === selectedId ? null : time.id;
        setSelectedId(nextId);
        onChange?.(nextId ? time : null);
    };

    return (
        <div
            className={`flex flex-wrap gap-3 sm:gap-4 md:gap-6 ${className ?? ""}`}
        >
            {times.map((time) => {
                const isSelected = selectedId === time.id;
                const base =
                    "rounded-[8px] px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 flex items-center justify-center text-fm-16 font-semibold transition-colors";
                const stateClass = time.disabled
                    ? "bg-gray-gc1b text-gray-gf7e/70 border border-gray-g63f cursor-not-allowed"
                    : isSelected
                        ? "bg-blue-bbee text-white"
                        : "bg-blue-b9a8 text-white hover:brightness-110";

                return (
                    <button
                        key={time.id}
                        type="button"
                        className={`${base} ${stateClass}`}
                        onClick={() => handleSelect(time)}
                        aria-pressed={isSelected}
                        disabled={time.disabled}
                    >
                        {time.label}
                    </button>
                );
            })}
        </div>
    );
};

export default ShowtimeSelection;


