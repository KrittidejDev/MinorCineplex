interface DateSelectionProps {
    day: string;
    date: string;
    isActive?: boolean;
    onSelect?: () => void;
    className?: string;
}

function DateSelection({ day, date, isActive = false, onSelect, className = "" }: DateSelectionProps) {
    return (
        <>
            <button onClick={onSelect} className={`w-fit h-fit hover:bg-gray-g63f flex flex-col py-2 px-[27.5px] lg:px-16 pl-4 items-center rounded-sm group ${className}
            ${isActive ? "bg-gray-g63f" : ""}`}>
                <h3 className={`text-f-24 text-gray-g3b0 group-hover:text-white-wfff
                    ${isActive ? "!text-white-wfff" : ""}`}>{day}</h3>
                <p className={`text-fr-16 text-gray-gf7e group-hover:text-gray-gedd
                    ${isActive ? "!text-gray-gedd" : ""}`}>{date}</p>
            </button>
        </>
    )
}

export default DateSelection