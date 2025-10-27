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
import {
  validateShowtimeFormData,
  validateShowtimeDateTime,
} from "@/lib/utils/showtimeValidation";

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
    date: "",
    price: "",
  });
  const [data, setData] = useState<ShowtimeData[]>([]);
  const [movies, setMovies] = useState<SelectOption[]>([]);
  const [cinemas, setCinemas] = useState<SelectCinemaOption[]>([]);
  const [timeSlots, setTimeSlots] = useState<SelectOption[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

// Fetch Showtime Data
  const getShowtime = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/admin/showtimes`, {
        params: {
          movie: query.movie,
          cinema: query.cinema,
          hall: query.hall,
          timeSlot: query.timeSlot,
          date: query.date,
          page: page,
        },
      });

      if (data && data.showTimes) {
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);

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
        return data.totalPages || 1;
      } else {
        setData([]);
        setTotal(0);
        setTotalPages(1);
        return 1;
      }
    } catch (error) {
      console.error("Error fetching showtimes:", error);
      setData([]);
      setTotal(0);
      setTotalPages(1);
      return 1;
    }
  }, [query, page]);

  useEffect(() => {
    getShowtime();
  }, [getShowtime]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  // Clear Form Data
  const clearFormData = () => {
    setFormData({
      movie_id: "",
      cinema_id: "",
      hall_id: "",
      time_slot_id: "",
      date: "",
      price: "",
    });
  };

// Fetch All Data For Query
  const fetchAll = async () => {
    try {
      const [resMovies, resCinemas, resTimeSlots] = await Promise.all([
        axios.get(`/api/admin/movies`),
        axios.get(`/api/admin/cinemas?type=dropdown`),
        axios.get(`/api/admin/time-slots`),
      ]);
      setMovies(
        resMovies.data.map((item: MovieBasicInfo) => ({
          value: item.id,
          label: item.title,
        }))
      );
      setCinemas(
        resCinemas.data.map((item: CinemaFromAPI) => ({
          value: item.id,
          label: item.name,
          halls: item.halls.map((hall) => ({
            value: hall.id,
            label: hall.name,
          })),
        }))
      );
      setTimeSlots(
        resTimeSlots.data.map((item: TimeSlotBasicInfo) => ({
          value: item.id,
          label: `${item.start_time} - ${item.end_time}`,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Handle Create Showtime
  const handleCreateShowtime = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<boolean> => {
    event.preventDefault();
    const formValidation = validateShowtimeFormData(formData);
    if (!formValidation.isValid) {
      alert(formValidation.errorMessage);
      return false;
    }

    const dateTimeValidation = validateShowtimeDateTime(
      formData.date,
      formData.time_slot_id,
      timeSlots
    );

    if (!dateTimeValidation.isValid) {
      alert(dateTimeValidation.errorMessage);
      return false;
    }

    try {
      const response = await axios.post(`/api/admin/showtimes`, {
        movie_id: formData.movie_id,
        hall_id: formData.hall_id,
        cinema_id: formData.cinema_id,
        time_slot_id: formData.time_slot_id,
        date: formData.date,
        price: parseFloat(formData.price) || 0,
      });
      if (response.status === 200) {
        alert("Showtime created successfully!");
        await getShowtime();
        clearFormData();
        const newTotalPages = await getShowtime();
        if (page > newTotalPages) {
          setPage(Math.max(newTotalPages, 1));
        }
        return true;
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Failed to create showtime";
        alert(`Error: ${errorMessage}`);
      } else {
        alert("Error: Failed to create showtime");
      }
      console.error(error);
      return false;
    }
  };

  // Handle Update Showtime
  const handleUpdateShowtime = async (id: string): Promise<boolean> => {
    const formValidation = validateShowtimeFormData(formData);
    if (!formValidation.isValid) {
      alert(formValidation.errorMessage);
      return false;
    }

    const dateTimeValidation = validateShowtimeDateTime(
      formData.date,
      formData.time_slot_id,
      timeSlots
    );

    if (!dateTimeValidation.isValid) {
      alert(dateTimeValidation.errorMessage);
      return false;
    }

    try {
      const response = await axios.put(`/api/showtimes/${id}`, {
        movie_id: formData.movie_id,
        hall_id: formData.hall_id,
        cinema_id: formData.cinema_id,
        time_slot_id: formData.time_slot_id,
        date: formData.date,
        price: parseFloat(formData.price) || 0,
      });
      if (response.status === 200) {
        alert("Showtime updated successfully!");
        const newTotalPages = await getShowtime();
        if (page > newTotalPages) {
          setPage(Math.max(newTotalPages, 1));
        }
        return true;
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Failed to update showtime";
        alert(`Error: ${errorMessage}`);
      } else {
        alert("Error: Failed to update showtime");
      }
      console.error(error);
      return false;
    }
  };

  // Handle Delete Showtime
  const handleDeleteShowtime = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this showtime?")) {
      try {
        const response = await axios.delete(`/api/showtimes/${id}`);
        if (response.status === 200) {
          console.log("Showtime deleted successfully");
          const newTotalPages = await getShowtime();
          if (page > newTotalPages) {
            setPage(Math.max(newTotalPages, 1));
          }
        } else {
          console.log("Failed to delete showtime");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="bg-white-wfff w-full">
      <div className="flex">
        <div>
          <AdminSidebar />
        </div>
        <div className="w-full">
          <AdminShowtimeWidget
            totalPages={totalPages}
            total={total}
            currentPage={page}
            setCurrentPage={setPage}
            data={data}
            query={query}
            setQuery={setQuery}
            formData={formData}
            setFormData={setFormData}
            clearFormData={clearFormData}
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
