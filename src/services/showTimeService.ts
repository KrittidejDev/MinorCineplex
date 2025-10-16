import * as showTimeRepo from "../repositories/showTImeRepository";

interface ShowTimeData {
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
  time_slot_id: string;
  date: string;
  price: number;
}

export interface UpdateShowTimeData {
  movie_id: string;
  hall_id: string;
  time_slot_id: string;
  date: string;
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
  const { data: showTimes, total } = await showTimeRepo.getManyForAdmin({
    limit,
    movie,
    cinema,
    hall,
    timeSlot,
    date,
    page,
  });

  const showTimesData = showTimes.map((showTime): ShowTimeData => {
    return {
      id: showTime.id,
      movie_id: showTime.movie.id,
      movie_title: showTime.movie.title,
      cinema_id: showTime.hall.cinema.id,
      cinema_name: showTime.hall.cinema.name,
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
      const timeSlot = await showTimeRepo.getTimeSlotById(
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
      showTime.date
    );
    if (existingShowtime) {
      throw new Error("Showtime already exists");
    }
    const createdShowTime = await showTimeRepo.createShowTime({
      movie_id: showTime.movie_id,
      hall_id: showTime.hall_id,
      time_slot_id: showTime.time_slot_id,
      date: showTime.date,
      price: showTime.price,
    });
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
      const timeSlot = await showTimeRepo.getTimeSlotById(
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

    const existingShowtime = await showTimeRepo.isShowtimeExists(
      showTime.hall_id,
      showTime.time_slot_id,
      showTime.date,
      id
    );
    if (existingShowtime) {
      throw new Error("Showtime already exists in this hall and time slot");
    }
    const showTimes = await showTimeRepo.updateShowTimeById(id, showTime);
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
  const showTimes = await showTimeRepo.getByID(id);
  return showTimes;
};

export const getBookingInfo = async (showtime_id: string) => {
  const data = await showTimeRepo.getBookingInfoByShowtimeId(showtime_id);
  return data;
};

export const deleteShowTimeById = async (id: string) => {
  const showTimes = await showTimeRepo.deleteShowTimeById(id);
  return showTimes;
};