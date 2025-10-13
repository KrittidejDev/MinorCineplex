import { ShowTimeData } from "../Widgets/AdminShowtimeWidget";
import { useEffect, useState } from "react";
import AdminComboBox from "../Inputs/AdminComboBox";
import {
  ShowtimeQuery,
  SelectOption,
  SelectCinemaOption,
} from "@/types/adminShowtime";
import InputAdminDate from "../Inputs/InputAdminDate";

interface AdminShowtimeFilterProps {
  data: ShowTimeData[];
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
      <div className="flex items-center gap-10 py-5">
        <div className="flex items-center gap-2">
          <p className="text-f-20 text-black">Date:</p>
          <span className="text-f-20 text-gray-g3b0">{query.date || "All Dates"}</span>
        </div>
        <div className="max-w-[200px]">
          <InputAdminDate
            label="Select Date"
            value={query.date}
            onChange={(value) => setQuery({ ...query, date: value })}
          />
        </div>
      </div>
      <div className="flex gap-4 justify-between">
        {queryOptions.map((option) => (
          <div key={option.field} className="min-w-[200px]">
            <AdminComboBox
              placeholder={`All ${option.label}s`}
              defaultValue=""
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
