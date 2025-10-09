import { CinemaDetail, HallDetail } from "@/types/cinema";
import * as cinemaRepo from "../repositories/cinemaRepository";

export const getCinemas = async () => {
  const cinema = await cinemaRepo.getAll();
  return cinema;
};

export const getCinemasByMovies = async (movie_id: string) => {
  const cinema = await cinemaRepo.getByMovies(movie_id);
  return cinema;
};

export const getCinemaById = async (id: string) => {
  const cinema = await cinemaRepo.getByID(id);
  return cinema;
};

export const getCinemasDetail = async (
  id: string,
  date?: string
): Promise<CinemaDetail | null> => {
  const targetDate = date ? new Date(date) : new Date();
  const dateStr = targetDate.toISOString().split("T")[0];

  const cinemaDetail = await cinemaRepo.cinemaRepo.getByIDDetail(id);
  if (!cinemaDetail) return null;

  // ดึง showtimes ทั้งหมดของโรงที่ match วันที่
  const showtimes = cinemaDetail.halls.flatMap((hall) =>
    (hall.showtimes ?? [])
      .filter((s) => s.date.toISOString().split("T")[0] === dateStr)
      .map((s) => ({
        id: s.id,
        date: s.date.toISOString().split("T")[0],
        price: s.price ?? 0,
        movie: {
          id: s.movie.id,
          title: s.movie.title,
          duration_min: s.movie.duration_min,
          poster_url: s.movie.poster_url ?? undefined,
          description: s.movie.description ?? undefined,
          genre: s.movie.genre ?? undefined,
          rating: s.movie.rating ?? undefined,
        },
        hall: {
          id: hall.id,
          name: hall.name,
          seat_count: hall.seat_count ?? undefined,
        },
        time_slot: s.time_slot
          ? {
              id: s.time_slot.id,
              name: s.time_slot.name,
              start_time: s.time_slot.start_time,
              end_time: s.time_slot.end_time,
            }
          : {
              id: "",
              name: "",
              start_time: "",
              end_time: "",
            },
        seats: (s.seats ?? []).map((seat) => ({
          id: seat.id,
          status: seat.status,
          price: seat.price ?? 0,
          seat_id: seat.seat_id,
          showtime_id: seat.showtime_id,
        })),
      }))
  );

  // Group by movie
  const movies = Object.values(
    showtimes.reduce(
      (acc, s) => {
        if (!acc[s.movie.id]) {
          acc[s.movie.id] = {
            ...s.movie,
            halls: [],
          };
        }

        let hall = acc[s.movie.id].halls.find((h: any) => h.id === s.hall.id);
        if (!hall) {
          hall = {
            ...s.hall,
            timeslots: [],
          };
          acc[s.movie.id].halls.push(hall);
        }

        hall.timeslots.push({
          showtime_id: s.id,
          ...s.time_slot,
          price: s.price,
          date: s.date,
          seats: s.seats,
        });

        return acc;
      },
      {} as Record<string, any>
    )
  );

  return {
    ...cinemaDetail,
    movies,
  } as unknown as CinemaDetail;
};
