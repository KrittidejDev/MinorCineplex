// services/bookingServices.ts
import { bookingRepository } from "@/repositories/bookingRepositories";
import { CinemaDTO, HallDTO, Seat } from "@/types/cinema";
import { MovieDTO } from "@/types/movie";
import { SeatTemplate } from "@/types/type";

interface SeatRow {
  row: string;
  seats: Seat[];
}

interface ShowTimeResponse {
  id: string;
  movie_id: string;
  cinema_id: string;
  hall_id: string;
  date: Date;
  time_slot_id: string;
  price: number;
}

interface ShowtimeSeat {
  id: string;
  seat_template: SeatTemplate;
  status: string;
  price: number;
  locked_by_user_id: string | null;
  locked_until: Date | null;
}

interface ShowtimeData {
  id: string;
  movie_id: string;
  cinema_id: string;
  hall_id: string;
  date: string;
  time_slot_id: string;
  price: number;
  seats: SeatRow[];
  movie?: MovieDTO;
  cinema?: CinemaDTO;
  hall?: HallDTO;
}

class BookingService {
  private seatRowsCache: Record<string, SeatRow[]> = {};

  async getShowtimeDetail(showtimeId: string): Promise<ShowtimeData> {
    const showtime = await bookingRepository.getShowtimeById(showtimeId);
    if (!showtime) throw new Error("Showtime not found");

    const [seats, movie, cinema, hall] = await Promise.all([
      this.getShowtimeSeats(showtimeId),
      bookingRepository.getMovieById(showtime.movie_id),
      bookingRepository.getCinemaById(showtime.cinema_id),
      bookingRepository.getHallById(showtime.hall_id),
    ]);

    return {
      ...(showtime as ShowTimeResponse),
      date: showtime.date.toISOString(),
      seats,
      movie: movie as MovieDTO,
      cinema: cinema as CinemaDTO,
      hall: hall as HallDTO,
    };
  }

  private async getShowtimeSeats(showtimeId: string): Promise<SeatRow[]> {
    if (this.seatRowsCache[showtimeId]) return this.seatRowsCache[showtimeId];

    const showtimeSeats =
      await bookingRepository.getSeatsByShowtimeId(showtimeId);
    const seatRows = this.transformSeatsToRows(showtimeSeats as ShowtimeSeat[]);

    this.seatRowsCache[showtimeId] = seatRows;
    return seatRows;
  }

  private transformSeatsToRows(showtimeSeats: ShowtimeSeat[]): SeatRow[] {
    const seatsByRow = new Map<string, Seat[]>();

    showtimeSeats.forEach((s) => {
      const row = s.seat_template.row;
      if (!seatsByRow.has(row)) seatsByRow.set(row, []);
      seatsByRow.get(row)!.push({
        id: s.id,
        seat_number: s.seat_template.seat_number,
        number: s.seat_template.seat_number,
        row,
        col: s.seat_template.col,
        status: s.status as "AVAILABLE" | "RESERVED" | "BOOKED" | "LOCKED",
        price: s.price,
        lockedBy: s.locked_by_user_id ?? null,
        lockExpire: s.locked_until ? new Date(s.locked_until).getTime() : null,
        seat: s.seat_template,
      });
    });

    const seatRows: SeatRow[] = Array.from(seatsByRow.entries())
      .map(([row, seats]) => ({
        row,
        seats: seats.sort((a, b) => parseInt(a.col) - parseInt(b.col)),
      }))
      .sort((a, b) => a.row.localeCompare(b.row));

    return seatRows;
  }
}

export const bookingService = new BookingService();
