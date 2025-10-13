import AdminSidebar from "@/components/ui/adminsidebar";
import AdminShowtimeWidget from "@/components/Widgets/AdminShowtimeWidget";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import {
  ShowtimeQuery,
  ShowtimeFormData,
  SelectOption,
  SelectCinemaOption,
  ShowtimeData,
  MovieBasicInfo,
  CinemaFromAPI,
  TimeSlotBasicInfo,
} from "@/types/adminShowtime";

export default function AdminShowtime() {
  const [query, setQuery] = useState<ShowtimeQuery>({
    movie: "",
    cinema: "",
    hall: "",
    timeSlot: "",
    date: "",
  });
  const [formData, setFormData] = useState<ShowtimeFormData>({
    movie_id: "",
    cinema_id: "",
    hall_id: "",
    time_slot_id: "",
    date: new Date().toISOString().split("T")[0],
    price: "",
  });
  const [data, setData] = useState([]);
  const [movies, setMovies] = useState<SelectOption[]>([]);
  const [cinemas, setCinemas] = useState<SelectCinemaOption[]>([]);
  const [timeSlots, setTimeSlots] = useState<SelectOption[]>([]);

  // Fetch Showtime Data
  const getShowtime = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/showtimes`, {
        params: {
          movie: query.movie,
          cinema: query.cinema,
          hall: query.hall,
          timeSlot: query.timeSlot,
          date: query.date,
        },
      });
      const mappedData = data.showTimes.map((item: ShowtimeData) => ({
        ...item,
        movie_id: item.movie_id,
        movie_title: item.movie_title,
        cinema_id: item.cinema_id,
        cinema_name: item.cinema_name,
        hall_id: item.hall_id,
        hall_name: item.hall_name,
        timeslot: item.timeslot,
        date: item.date,
        time_slot: `${item.start_time} - ${item.end_time}`,
      }));
      setData(mappedData);
    } catch (error) {
      console.log(error);
    }
  }, [query]);
  console.log("formData", formData);

  // Fetch Data For Query
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

  // CreateNewShowtimeForm
  const handleCreateShowtime = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<boolean> => {
    event.preventDefault();
    
    // Frontend validation
    if (!formData.movie_id || !formData.hall_id || !formData.time_slot_id || !formData.date || !formData.price) {
      alert("Please fill in all required fields");
      return false;
    }

    try {
      const response = await axios.post(`http://localhost:3000/api/showtimes`, {
        movie_id: formData.movie_id,
        hall_id: formData.hall_id,
        time_slot_id: formData.time_slot_id,
        date: formData.date,
        price: parseFloat(formData.price) || 0,
      });
      if (response.status === 200) {
        alert("Showtime created successfully!");
        await getShowtime();
        setFormData({
          movie_id: "",
          cinema_id: "",
          hall_id: "",
          time_slot_id: "",
          date: new Date().toISOString().split("T")[0],
          price: "",
        });
        return true;
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Failed to create showtime";
        alert(`Error: ${errorMessage}`);
      } else {
        alert("Error: Failed to create showtime");
      }
      console.error(error);
      return false;
    }
  };

  // Update Showtime
  const handleUpdateShowtime = async (id: string): Promise<boolean> => {
    // Frontend validation
    if (!formData.movie_id || !formData.hall_id || !formData.time_slot_id || !formData.date || !formData.price) {
      alert("Please fill in all required fields");
      return false;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/showtimes/${id}`,
        {
          movie_id: formData.movie_id,
          hall_id: formData.hall_id,
          time_slot_id: formData.time_slot_id,
          date: formData.date,
          price: parseFloat(formData.price) || 0,
        }
      );
      if (response.status === 200) {
        alert("Showtime updated successfully!");
        await getShowtime();
        return true;
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Failed to update showtime";
        alert(`Error: ${errorMessage}`);
      } else {
        alert("Error: Failed to update showtime");
      }
      console.error(error);
      return false;
    }
  };

  // Delete Showtime
  const handleDeleteShowtime = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this showtime?")) {
      try {
        const reponse = await axios.delete(
          `http://localhost:3000/api/showtimes/${id}`
        );
        if (reponse.status === 200) {
          console.log("Showtime deleted successfully");
          await getShowtime();
        } else {
          console.log("Failed to delete showtime");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    getShowtime();
  }, [query, getShowtime]);

  return (
    <div className="bg-white-wfff">
      <div className="flex">
        <div>
          <AdminSidebar />
        </div>
        <div className="w-full">
          <AdminShowtimeWidget
            data={data}
            query={query}
            setQuery={setQuery}
            formData={formData}
            setFormData={setFormData}
            movies={movies}
            cinemas={cinemas}
            timeSlots={timeSlots}
            handleCreateShowtime={handleCreateShowtime}
            handleUpdateShowtime={handleUpdateShowtime}
            handleDeleteShowtime={handleDeleteShowtime}
          />
        </div>
      </div>
    </div>
  );
}
