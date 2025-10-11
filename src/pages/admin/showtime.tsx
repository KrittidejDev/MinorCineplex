import AdminSidebar from "@/components/ui/adminsidebar";
import AdminShowtimeWidget from "@/components/Widgets/AdminShowtimeWidget";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export interface ShowtimeQuery {
  movie: string;
  cinema: string;
  hall: string;
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
  });
  const [data, setData] = useState([]);
  const [movies, setMovies] = useState<SelectOption[]>([]);
  const [cinemas, setCinemas] = useState<SelectCinemaOption[]>([]);

  const getShowtime = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/showtimes`, {
        params: {
          limit: limit,
          page: page,
          movie: query.movie,
          cinema: query.cinema,
          hall: query.hall,
        },
      });
      setData(data.showTimes);
    } catch (error) {
      console.log(error);
    }
  }, [limit, page, query]);

  const getMovies = async () => {
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

  const getCinemas = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/cinemas?type=dropdown`
      );
      setCinemas(
        data.cinema.map((item: CinemaFromAPI) => ({
          value: item.id,
          label: item.name,
          halls: item.halls.map((hall) => ({
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
    getMovies();
    getCinemas();
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
            query={query}
            movies={movies}
            cinemas={cinemas}
          />
        </div>
      </div>
    </div>
  );
}
