import * as showTimeRepo from "@/repositories/showtimeRepository";
import * as timeSlotRepo from "@/repositories/timeSlotRepository";

export interface ShowTimeData {
  id: string;
  movie_id: string;
  movie_title: string;
  cinema_id: string;
  cinema_name: string;
  hall_id: string;
  hall_name: string;
  timeslot: string;
  start_time: string;
  end_time: string;
  date: Date;
  price: number;
}

export interface CreateShowTimeData {
  movie_id: string;
  hall_id: string;
  cinema_id: string;
  time_slot_id: string;
  date: Date;
  price: number;
}

export interface UpdateShowTimeData {
  movie_id: string;
  hall_id: string;
  cinema_id: string;
  time_slot_id: string;
  date: Date;
  price: number;
}

export interface ShowTimeFilter {
  limit?: number;
  movie?: string;
  cinema?: string;
  hall?: string;
  timeSlot?: string;
  date?: string;
  page?: number;
}

export const getShowTimesForAdmin = async ({
  limit,
  movie,
  cinema,
  hall,
  timeSlot,
  date,
  page,
}: ShowTimeFilter) => {
  const { showtimes, total } = await showTimeRepo.getManyForAdmin({
    limit,
    movie,
    cinema,
    hall,
    timeSlot,
    date,
    page,
  });

  const showTimesData = showtimes.map((showTime): ShowTimeData => {
    return {
      id: showTime.id,
      movie_id: showTime.movie.id,
      movie_title: showTime.movie.title,
      cinema_id: showTime.cinema.id,
      cinema_name: showTime.cinema.name,
      hall_id: showTime.hall.id,
      hall_name: showTime.hall.name,
      timeslot: showTime.time_slot.id,
      start_time: showTime.time_slot.start_time,
      end_time: showTime.time_slot.end_time,
      date: showTime.date,
      price: showTime.price,
    };
  });

  return { showTimes: showTimesData, total };
};

export const createShowTime = async (showTime: CreateShowTimeData) => {
  try {
    const selectedDate = new Date(showTime.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);

    if (selectedDay < today) {
      throw new Error("Cannot create showtime for past dates");
    }

    if (selectedDay.getTime() === today.getTime()) {
      const timeSlot = await timeSlotRepo.getTimeSlotById(
        showTime.time_slot_id
      );

      if (timeSlot) {
        const currentTime = new Date();
        const [hours, minutes] = timeSlot.start_time.split(":").map(Number);
        const showtimeDateTime = new Date(selectedDate);
        showtimeDateTime.setHours(hours, minutes, 0, 0);

        if (showtimeDateTime <= currentTime) {
          throw new Error("Cannot create showtime for past time slots");
        }
      }
    }

    const existingShowtime = await showTimeRepo.isShowtimeExists(
      showTime.hall_id,
      showTime.time_slot_id,
      new Date(showTime.date)
    );
    if (existingShowtime) {
      throw new Error("Showtime already exists");
    }
    // Validate and format date
    if (!showTime.date) {
      throw new Error("Date is required");
    }
    
    const showtimeDate = new Date(showTime.date);
    if (isNaN(showtimeDate.getTime())) {
      throw new Error("Invalid date format");
    }

    const createdShowTime = await showTimeRepo.createShowtime({
      movie_id: showTime.movie_id,
      cinema_id: showTime.cinema_id,
      hall_id: showTime.hall_id,
      time_slot_id: showTime.time_slot_id,
      date: showtimeDate,
      price: showTime.price,
    } as CreateShowTimeData);
    
    // Create seats for the new showtime
    await showTimeRepo.createShowtimeSeats(createdShowTime.id);
    
    return createdShowTime;
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create show time");
  }
};

export const updateShowTimeById = async (
  id: string,
  showTime: UpdateShowTimeData
) => {
  try {
    const selectedDate = new Date(showTime.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);

    if (selectedDay < today) {
      throw new Error("Cannot update showtime for past dates");
    }

    if (selectedDay.getTime() === today.getTime()) {
      const timeSlot = await timeSlotRepo.getTimeSlotById(
        showTime.time_slot_id
      );

      if (timeSlot) {
        const currentTime = new Date();
        const [hours, minutes] = timeSlot.start_time.split(":").map(Number);
        const showtimeDateTime = new Date(selectedDate);
        showtimeDateTime.setHours(hours, minutes, 0, 0);

        if (showtimeDateTime <= currentTime) {
          throw new Error("Cannot update showtime for past time slots");
        }
      }
    }

    // Validate and format date
    if (!showTime.date) {
      throw new Error("Date is required");
    }
    
    const showtimeDate = new Date(showTime.date);
    if (isNaN(showtimeDate.getTime())) {
      throw new Error("Invalid date format");
    }

    const existingShowtime = await showTimeRepo.isShowtimeExists(
      showTime.hall_id,
      showTime.time_slot_id,
      showtimeDate,
      id
    );
    if (existingShowtime) {
      throw new Error("Showtime already exists in this hall and time slot");
    }
    
    const showTimes = await showTimeRepo.updateShowtimeById(id, {
      movie_id: showTime.movie_id,
      hall_id: showTime.hall_id,
      cinema_id: showTime.cinema_id,
      time_slot_id: showTime.time_slot_id,
      date: showtimeDate,
      price: showTime.price,
    });
    return showTimes;
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update show time");
  }
};

export const getShowTimeById = async (id: string) => {
  const showTimes = await showTimeRepo.getShowtimeById(id);
  return showTimes;
};

export const getBookingInfo = async (showtime_id: string) => {
  const data = await showTimeRepo.getShowtimeById(showtime_id);
  return data;
};

export const deleteShowTimeById = async (id: string) => {
  const showTimes = await showTimeRepo.deleteShowtimeById(id);
  return showTimes;
};
