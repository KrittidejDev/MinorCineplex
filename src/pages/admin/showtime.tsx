import AdminSidebar from "@/components/ui/adminsidebar";
import AdminShowtimeWidget from "@/components/Widgets/AdminShowtimeWidget";
import axios from "axios";
import { useState, useEffect } from "react";

export interface ShowtimeQuery {
  movie: string;
  cinema: string;
  hall: string;
}

export default function AdminShowtime() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [query, setQuery] = useState<ShowtimeQuery>({
    movie: "",
    cinema: "",
    hall: "",
  });
  const [data, setData] = useState([]);
  const getShowtime = async () => {
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
  };

  useEffect(() => {
    getShowtime();
  }, [page, limit, query]);

  return (
    <div className="bg-white-wfff">
      <div className="flex">
        <div>
          <AdminSidebar />
        </div>
        <div className="w-full">
          <AdminShowtimeWidget data={data} setQuery={setQuery} query={query} />
        </div>
      </div>
    </div>
  );
}
