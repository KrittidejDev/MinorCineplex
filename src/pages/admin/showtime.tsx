import AdminSidebar from "@/components/ui/adminsidebar";
import AdminShowtimeWidget from "@/components/Widgets/AdminShowtimeWidget";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export interface ShowtimeQuery {
  movie: string;
  cinema: string;
  hall: string;
  timeSlot: string;
  date: string;
}

export interface ShowtimeFormData {
  movie: string;
  cinema: string;
  hall: string;
  timeSlot: string;
  date: string;
  price: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectCinemaOption extends SelectOption {
  halls: SelectOption[];
}

interface MovieBasicInfo {
  id: string;
  title: string;
}

interface TimeSlotBasicInfo {
  id: string;
  start_time: string;
  end_time: string;
}

interface CinemaFromAPI {
  id: string;
  name: string;
  halls: {
    id: string;
    name: string;
  }[];
}

export default function AdminShowtime() {
  const [page] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [query, setQuery] = useState<ShowtimeQuery>({
    movie: "",
    cinema: "",
    hall: "",
    timeSlot: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [formData, setFormData] = useState<ShowtimeFormData>({
    movie: "",
    cinema: "",
    hall: "",
    timeSlot: "",
    date: new Date().toISOString().split("T")[0],
    price: 100,
  });
  const [data, setData] = useState([]);
  const [movies, setMovies] = useState<SelectOption[]>([]);
  const [cinemas, setCinemas] = useState<SelectCinemaOption[]>([]);
  const [timeSlots, setTimeSlots] = useState<SelectOption[]>([]);

  const getShowtime = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/showtimes`, {
        params: {
          limit: limit,
          page: page,
          movie: query.movie,
          cinema: query.cinema,
          hall: query.hall,
          timeSlot: query.timeSlot,
          date: query.date,
        },
      });
      setData(
        (data.showTimes = data.showTimes.map((item: TimeSlotBasicInfo) => ({
          ...item,
          time_slot: `${item.start_time} - ${item.end_time}`,
        })))
      );
    } catch (error) {
      console.log(error);
    }
  }, [limit, page, query]);
  const fetchAll = async () => {
    try {
      const [resMovies, resCinemas, resTimeSlots] = await Promise.all([
        axios.get(`http://localhost:3000/api/movies`),
        axios.get(`http://localhost:3000/api/cinemas?type=dropdown`),
        axios.get(`http://localhost:3000/api/time-slots`),
      ]);
      setMovies(
        resMovies.data.movie.map((item: MovieBasicInfo) => ({
          value: item.id,
          label: item.title,
        }))
      );
      setCinemas(
        resCinemas.data.cinema.map((item: CinemaFromAPI) => ({
          value: item.id,
          label: item.name,
          halls: item.halls.map((hall) => ({
            value: hall.id,
            label: hall.name,
          })),
        }))
      );
      setTimeSlots(
        resTimeSlots.data.timeSlots.map((item: TimeSlotBasicInfo) => ({
          value: item.id,
          label: `${item.start_time} - ${item.end_time}`,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
console.log("query", query);

  const handleCreateShowtime = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/api/showtimes`,
        formData
      );
      if (response.status === 200) {
        console.log("Showtime created successfully");
      } else {
        console.log("Failed to create showtime");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    getShowtime();
  }, [page, limit, query, getShowtime]);

  return (
    <div className="bg-white-wfff">
      <div className="flex">
        <div>
          <AdminSidebar />
        </div>
        <div className="w-full">
          <AdminShowtimeWidget
            data={data}
            setQuery={setQuery}
            setFormData={setFormData}
            handleCreateShowtime={handleCreateShowtime}
            formData={formData}
            query={query}
            movies={movies}
            cinemas={cinemas}
            timeSlots={timeSlots}
          />
        </div>
      </div>
    </div>
  );
}
