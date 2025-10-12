import * as showTimeRepo from "../repositories/showTImeRepository";

interface ShowTimeData {
  id: string;
  movie: string;
  cinema: string;
  hall: string;
  start_time: string;
  end_time: string;
  date: Date;
}

export interface CreateShowTimeData {
  movie: string;
  hall: string;
  timeSlot: string;
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
}

export const getShowTimes = async ({
  limit,
  movie,
  cinema,
  hall,
  timeSlot,
  date,
}: ShowTimeFilter) => {
  const showTimes = await showTimeRepo.getMany({
    limit,
    movie,
    cinema,
    hall,
    timeSlot,
    date,
  });
  const showTimesData = showTimes.map((showTime): ShowTimeData => {
    return {
      id: showTime.id,
      movie: showTime.movie.title,
      cinema: showTime.hall.cinema.name,
      hall: showTime.hall.name,
      start_time: showTime.time_slot.start_time,
      end_time: showTime.time_slot.end_time,
      date: showTime.date,
    };
  });
  return showTimesData;
};

export const createShowTime = async (showTime: CreateShowTimeData) => {
  try {
    const existingShowtime = await showTimeRepo.isShowtimeExists(showTime.hall, showTime.timeSlot, showTime.date);
    if (existingShowtime) {
      throw new Error("Showtime already exists");
    }
    const createdShowTime = await showTimeRepo.createShowTime({
      movie: showTime.movie,
      hall: showTime.hall,
      timeSlot: showTime.timeSlot,
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

export const getShowTimeById = async (id: string) => {
  const showTimes = await showTimeRepo.getByID(id);
  return showTimes;
};

export const getBookingInfo = async (showtime_id: string) => {
  const data = await showTimeRepo.getBookingInfoByShowtimeId(showtime_id);
  return data;
};
