import * as showTimeRepo from "../repositories/showTImeRepository";

interface ShowTimeData {
  id: string;
  movie: string;
  cinema: string;
  hall: string;
  timeslot: string;
}

export interface ShowTimeFilter {
  limit?: number;
  movie?: string;
  cinema?: string;
  hall?: string;
}

export const getShowTimes = async ({ limit, movie, cinema, hall }: ShowTimeFilter) => {
  const showTimes = await showTimeRepo.getMany({ limit, movie, cinema, hall });
  const showTimesData = showTimes.map((showTime): ShowTimeData => {
    return {
      id: showTime.id,
      movie: showTime.movie.title,
      cinema: showTime.hall.cinema.name,
      hall: showTime.hall.name,
      timeslot: showTime.time_slot.start_time,
    };
  });
  return showTimesData;
};

export const getShowTimeById = async (id: string) => {
  const showTimes = await showTimeRepo.getByID(id);
  return showTimes;
};

export const getBookingInfo = async (showtime_id: string) => {
  const data = await showTimeRepo.getBookingInfoByShowtimeId(showtime_id);
  return data;
};
