import axios from "axios";
import { ShowTimeData } from "../Widgets/AdminShowtimeWidget";
import { useEffect, useState } from "react";
import AdminComboBox from "../Inputs/AdminComboBox";
import { ShowtimeQuery } from "@/pages/admin/showtime";

interface AdminShowtimeFilterProps {
  data: ShowTimeData[];
  query: ShowtimeQuery;
  setQuery: (query: ShowtimeQuery) => void;
}

interface MovieBasicInfo {
  id: string;
  title: string;
}

interface CinemaFromAPI {
  id: string;
  name: string;
  halls: HallFromAPI[];
}
interface HallFromAPI {
  id: string;
  name: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectCinemaOption {
  value: string;
  label: string;
  halls: SelectOption[];
}

const AdminShowtimeFilter = ({ setQuery, query }: AdminShowtimeFilterProps) => {
  const [movies, setMovies] = useState<SelectOption[]>([]);
  const [cinemas, setCinemas] = useState<SelectCinemaOption[]>([]);
  const [halls, setHalls] = useState<SelectOption[]>([]);
  // const [timeslot, setTimeslot] = useState([]);

  useEffect(() => {
    if (query.cinema) {
      const selectedCinema = cinemas.find(
        (item: SelectCinemaOption) => item.value === query.cinema
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
    // {
    //   field: "timeslot",
    //   label: "Timeslot",
    //   options: timeslot,
    // },
  ];

  const getMovie = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/movies`);
      setMovies(
        data.movie.map((item: MovieBasicInfo) => ({
          value: item.id,
          label: item.title,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getCinema = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/cinemas?type=dropdown`
      );
      setCinemas(
        data.cinema.map((item: CinemaFromAPI) => ({
          value: item.id,
          label: item.name,
          halls: item.halls.map((hall: HallFromAPI) => ({
            value: hall.id,
            label: hall.name,
          })),
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMovie();
    getCinema();
  }, []);

  return (
    <div className="flex gap-4 justify-between">
      {queryOptions.map((option) => (
        <div key={option.field} className="min-w-[200px]">
          <AdminComboBox
            placeholder={`All ${option.label}s`}
            defaultValue=""
            value={query[option.field as keyof ShowtimeQuery]}
            onChange={(value) => setQuery({ ...query, [option.field]: value })}
            options={option.options}
            disabled={option.field === "hall" && query.cinema === ""}
          />
        </div>
      ))}
    </div>
  );
};
export default AdminShowtimeFilter;
