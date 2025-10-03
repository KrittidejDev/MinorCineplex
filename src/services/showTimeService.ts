import * as showTimeRepo from "../repositories/showTImeRepository";

export const getShowTimes = async (movie_id: string) => {
  const showTimes = await showTimeRepo.getMany(movie_id);
  return showTimes;
};

export const getShowTimeById = async (id: string) => {
  const showTimes = await showTimeRepo.getByID(id);
  return showTimes;
};

export const getBookingInfo = async (showtime_id: string) => {
  const data = await showTimeRepo.getBookingInfoByShowtimeId(showtime_id);
  return data;
};
