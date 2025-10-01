import { CinemaDetail, HallDetail } from "@/types/cinema";
import * as cinemaRepo from "../repositories/cinemaRepository";
import { addDays, startOfDay, endOfDay } from "date-fns";

export const getCinemas = async () => {
  const cinema = await cinemaRepo.getMany();
  return cinema;
};

export const getCinemaById = async (id: string) => {
  const cinema = await cinemaRepo.getByID(id);
  return cinema;
};

export const getCinemasDetail = async (
  id: string,
  date?: string // เพิ่ม param วันที่เลือก
): Promise<CinemaDetail | null> => {
  const targetDate = date ? new Date(date) : new Date();

  const dayStart = startOfDay(targetDate);
  const dayEnd = endOfDay(targetDate);

  const cinemaDetail = await cinemaRepo.getByIDDetail(id);

  if (!cinemaDetail) return null;

  const hallsWithShowtimes: HallDetail[] = cinemaDetail.halls.map((hall) => ({
    ...hall,
    seat_count: hall.seat_count ?? undefined,
    showtimes: hall.showtimes
      .map((s) => ({
        ...s,
        movie: {
          ...s.movie,
          poster_url: s.movie.poster_url ?? undefined,
          description: s.movie.description ?? undefined,
          description_en: s.movie.description_en ?? undefined,
          title_en: s.movie.title_en ?? undefined,
          genre_en: s.movie.genre_en ?? undefined,
        },
        time_slot: s.time_slot ?? undefined,
        seats: s.seats ?? undefined,
      }))
      .filter((s) => s.date >= dayStart && s.date <= dayEnd), // กรองตามวันที่
  }));

  return {
    ...cinemaDetail,
    showtimesByDay: [
      {
        date: dayStart.toISOString().split("T")[0],
        halls: hallsWithShowtimes,
      },
    ],
  } as CinemaDetail;
};
