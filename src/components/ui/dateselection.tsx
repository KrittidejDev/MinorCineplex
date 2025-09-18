import { useState } from "react";

interface DateSelectionProps {
  day: string;
  date: string;
}

function DateSelection({day, date}: DateSelectionProps) {

    return (
        <>
            <button className={`w-fit h-fit hover:bg-gray-g63f flex flex-col py-2 px-16 items-center rounded-sm group`}>
                <h3 className="text-f-24 text-gray-g3b0 group-hover:text-white-wfff">{day}</h3>
                <p className="text-fr-16 text-gray-gf7e group-hover:text-gray-gedd">{date}</p>
            </button>
        </>
    )
}

export default DateSelection