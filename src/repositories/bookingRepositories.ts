// repositories/bookingRepositories.ts
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const bookingRepository = {
  async getShowtimeById(id: string) {
    return prisma.showtime.findUnique({
      where: { id },
      select: {
        id: true,
        movie_id: true,
        cinema_id: true,
        hall_id: true,
        date: true,
        time_slot_id: true,
        time_slot: {
          select: {
            name: true,
          },
        },
        price: true,
      },
    });
  },

  async getMovieById(id: string) {
    return prisma.movie.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        poster_url: true,
        duration_min: true,
        genres: {
          select: {
            genre: {
              select: {
                translations: true,
              },
            },
          },
        },
        languages: {
          select: {
            language: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });
  },

  async getCinemaById(id: string) {
    return prisma.cinema.findUnique({
      where: { id },
      select: { id: true, translations: true },
    });
  },

  async getHallById(id: string) {
    return prisma.hall.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
  },

  async getSeatsByShowtimeId(showtimeId: string) {
    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      select: { price: true },
    });

    if (!showtime) return [];

    const seats = await prisma.showtimeSeat.findMany({
      where: { showtime_id: showtimeId },
      select: {
        id: true,
        status: true,
        price: true,
        locked_by_user_id: true,
        locked_until: true,
        seat_template: {
          select: {
            id: true,
            seat_number: true,
            row: true,
            col: true,
          },
        },
      },
      orderBy: [
        { seat_template: { row: "asc" } },
        { seat_template: { col: "asc" } },
      ],
    });

    return seats.map((s) => ({
      id: s.id,
      showtime_id: showtimeId,
      seat_number: s.seat_template.seat_number,
      row: s.seat_template.row,
      col: s.seat_template.col,
      status: s.status as "AVAILABLE" | "RESERVED" | "BOOKED" | "LOCKED",
      price: showtime.price,
      locked_by_user_id: s.locked_by_user_id ?? null,
      locked_until: s.locked_until ? new Date(s.locked_until).getTime() : null,
    }));
  },
};
