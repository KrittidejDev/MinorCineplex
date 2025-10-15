// services/movieShowtimeService.ts
import { prisma } from "@/lib/prisma";

interface MovieShowtimeDetail {
  id: string;
  title: string;
  title_en?: string;
  duration_min: number;
  description?: string;
  description_en?: string;
  poster_url?: string;
  trailer_url?: string;
  genre?: string;
  genre_en?: string;
  rating?: string;
  release_date?: string;
  cinemas: CinemaShowtime[];
}

interface CinemaShowtime {
  id: string;
  name: string;
  name_en?: string;
  address: string;
  phone?: string;
  province?: string;
  province_en?: string;
  halls: HallShowtime[];
}

interface HallShowtime {
  id: string;
  name: string;
  seat_count?: number;
  timeslots: TimeSlotShowtime[];
}

interface TimeSlotShowtime {
  showtime_id: string;
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  price: number;
  date: string;
  available_seats: number;
  total_seats: number;
}

export const getMovieShowtimeDetail = async (
  movieId: string,
  date?: string
): Promise<MovieShowtimeDetail | null> => {
  // กำหนดวันที่
  const targetDate = date ? new Date(date) : new Date();
  const dateStr = targetDate.toISOString().split("T")[0];

  // ดึงข้อมูลหนัง
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      showtimes: {
        where: {
          date: {
            gte: new Date(`${dateStr}T00:00:00.000Z`),
            lt: new Date(`${dateStr}T23:59:59.999Z`),
          },
        },
        include: {
          hall: {
            include: {
              cinema: true,
            },
          },
          time_slot: true,
          seats: {
            select: {
              id: true,
              status: true,
            },
          },
        },
        orderBy: [
          { hall: { cinema: { name: "asc" } } },
          { hall: { name: "asc" } },
          { time_slot: { start_time: "asc" } },
        ],
      },
    },
  });

  if (!movie) return null;

  // จัดกลุ่มข้อมูลตาม cinema -> hall -> timeslot
  const cinemaMap = new Map<string, CinemaShowtime>();

  for (const showtime of movie.showtimes) {
    const cinema = showtime.hall.cinema;
    const cinemaId = cinema.id;

    // สร้าง cinema ถ้ายังไม่มี
    if (!cinemaMap.has(cinemaId)) {
      cinemaMap.set(cinemaId, {
        id: cinema.id,
        name: cinema.name,
        name_en: cinema.name_en || undefined,
        address: cinema.address,
        phone: cinema.phone || undefined,
        province: cinema.province || undefined,
        province_en: cinema.province_en || undefined,
        halls: [],
      });
    }

    const cinemaData = cinemaMap.get(cinemaId)!;

    // หา hall หรือสร้างใหม่
    let hall = cinemaData.halls.find((h) => h.id === showtime.hall.id);
    if (!hall) {
      hall = {
        id: showtime.hall.id,
        name: showtime.hall.name,
        seat_count: showtime.hall.seat_count || undefined,
        timeslots: [],
      };
      cinemaData.halls.push(hall);
    }

    // คำนวณที่นั่งว่าง
    const totalSeats = showtime.seats.length;
    const availableSeats = showtime.seats.filter(
      (s) => s.status === "AVAILABLE"
    ).length;

    // เพิ่ม timeslot
    hall.timeslots.push({
      showtime_id: showtime.id,
      id: showtime.time_slot.id,
      name: showtime.time_slot.name,
      start_time: showtime.time_slot.start_time,
      end_time: showtime.time_slot.end_time,
      price: showtime.price,
      date: showtime.date.toISOString().split("T")[0],
      available_seats: availableSeats,
      total_seats: totalSeats,
    });
  }

  return {
    id: movie.id,
    title: movie.title,
    title_en: movie.title_en || undefined,
    duration_min: movie.duration_min,
    description: movie.description || undefined,
    description_en: movie.description_en || undefined,
    poster_url: movie.poster_url || undefined,
    trailer_url: movie.trailer_url || undefined,
    genre: movie.genre || undefined,
    genre_en: movie.genre_en || undefined,
    rating: movie.rating || undefined,
    release_date: movie.release_date
      ? movie.release_date.toISOString().split("T")[0]
      : undefined,
    cinemas: Array.from(cinemaMap.values()),
  };
};
