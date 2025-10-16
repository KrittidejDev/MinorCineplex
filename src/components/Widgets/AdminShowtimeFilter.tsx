import { ShowtimeData } from "@/types/adminShowtime";
import { useEffect, useState } from "react";
import AdminComboBox from "../Inputs/AdminComboBox";
import {
  ShowtimeQuery,
  SelectOption,
  SelectCinemaOption,
} from "@/types/adminShowtime";
import InputAdminDate from "../Inputs/InputAdminDate";
import { CloseRoundLight } from "../Icons/Icons";

interface AdminShowtimeFilterProps {
  data: ShowtimeData[];
  query: ShowtimeQuery;
  setQuery: (query: ShowtimeQuery) => void;
  movies: SelectOption[];
  cinemas: SelectCinemaOption[];
  timeSlots: SelectOption[];
}

const AdminShowtimeFilter = ({
  setQuery,
  query,
  movies,
  cinemas,
  timeSlots,
}: AdminShowtimeFilterProps) => {
  const [halls, setHalls] = useState<SelectOption[]>([]);

  const clearQuery = () => {
    setQuery({
      movie: "",
      cinema: "",
      hall: "",
      timeSlot: "",
      date: "",
    });
  };

  useEffect(() => {
    if (query.cinema) {
      const selectedCinema = cinemas.find(
        (item) => item.value === query.cinema
      );
      if (selectedCinema) {
        setHalls(selectedCinema.halls);
      }
    } else {
      setHalls([]);
    }
  }, [query.cinema, cinemas]);

  const queryOptions = [
    {
      field: "movie",
      label: "Movie",
      options: movies,
    },
    {
      field: "cinema",
      label: "Cinema",
      options: cinemas,
    },
    {
      field: "hall",
      label: "Hall",
      options: halls,
    },
    {
      field: "timeSlot",
      label: "Timeslot",
      options: timeSlots,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-5">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <p className="text-f-20 text-black">Date:</p>
            <span className="text-f-20 text-gray-g3b0">
              {query.date || "All Dates"}
            </span>
          </div>
          <div className="flex max-w-[200px]">
            <InputAdminDate
              label="Select Date"
              value={query.date}
              onChange={(value) => setQuery({ ...query, date: value })}
            />
            <CloseRoundLight
              onClick={() => setQuery({ ...query, date: "" })}
              width={20}
              height={20}
              color={"#000000"}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="h-12 flex items-center justify-center btn-base blue-normal text-fm-16"
            onClick={clearQuery}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex gap-4 justify-between">
        {queryOptions.map((option) => (
          <div key={option.field} className="w-full min-w-[200px]">
            <AdminComboBox
              placeholder={`All ${option.label}s`}
              value={query[option.field as keyof ShowtimeQuery]}
              onChange={(value) =>
                setQuery({ ...query, [option.field]: value })
              }
              options={option.options}
              disabled={option.field === "hall" && query.cinema === ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminShowtimeFilter;
