import AdminSidebar from "@/components/ui/adminsidebar";
import AdminShowtimeWidget from "@/components/Widgets/AdminShowtimeWidget";
import axios from "axios";
import { useState,useEffect } from "react";


export default function AdminShowtime() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState({
    movie: "Your Letter",
    cinema: "เมเจอร์ ทีเอ็มเค กาญจนบุรี",
    hall: "",
  });
  const [data, setData] = useState([]);
  const getShowtime = async () => {
    const {data} = await axios.get(`http://localhost:3000/api/showtimes`,{
      params: {
        limit: limit,
        page: page,
        movie: query.movie,
        cinema: query.cinema,
        hall: query.hall
      },
    });
    setData(data.showTimes);
  };
  useEffect(() => {
    getShowtime();
  }, [page, limit, query]);
console.log(data);


  return (
    <div className="bg-white-wfff">
      <div className="flex">
        <div>
        <AdminSidebar />
      </div>
      <div className="w-full">
        <AdminShowtimeWidget data={data} />
      </div>
      </div>
    </div>
  );
}
