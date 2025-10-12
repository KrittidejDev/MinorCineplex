import { PrismaClient } from "@/generated/prisma";
import {
  CreateShowTimeData,
  ShowTimeFilter,
} from "../services/showTimeService";

const prisma = new PrismaClient();

export const getMany = ({
  limit,
  movie,
  cinema,
  hall,
  timeSlot,
  date,
}: ShowTimeFilter) => {
  let hallFilter = undefined;
  if (cinema && hall) {
    hallFilter = { cinema: { id: cinema }, id: hall };
  } else if (cinema) {
    hallFilter = { cinema: { id: cinema } };
  } else if (hall) {
    hallFilter = { id: hall };
  }
 
  const where = {
    ...(movie && { movie: { id: movie } }),
    ...(hallFilter && { hall: hallFilter }),
    ...(timeSlot && { time_slot: { id: timeSlot } }),
    ...(date && { date: new Date(date) }),
  };
  return prisma.showtime.findMany({
    take: limit,
    where,
    select: {
      id: true,
      date: true,
      movie: {
        select: {
          title: true,
        },
      },
      hall: {
        select: {
          name: true,
          cinema: {
            select: {
              name: true,
            },
          },
        },
      },
      time_slot: {
        select: {
          start_time: true,
          end_time: true,
        },
      },
    },
  });
};

export const getByID = (id: string) => {
  return prisma.showtime.findUnique({
    where: { id },
    select: {
      id: true,
      date: true,
      price: true,
      movie: {
        select: {
          id: true,
          title: true,
          duration_min: true,
          poster_url: true,
          rating: true,
          genre: true,
        },
      },
      hall: {
        select: {
          id: true,
          name: true,
        },
      },
      time_slot: {
        select: {
          id: true,
          start_time: true,
          end_time: true,
        },
      },
    },
  });
};

export const getBookingInfoByShowtimeId = async (showtime_id: string) => {
  const showtime = await prisma.showtime.findUnique({
    where: { id: showtime_id },
    select: {
      id: true,
      date: true,
      price: true,
      hall: {
        select: {
          id: true,
          name: true,
          cinema: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      movie: {
        select: {
          id: true,
          title: true,
          poster_url: true,
          duration_min: true,
          rating: true,
          genre: true,
          description: true,
        },
      },
      time_slot: {
        select: {
          start_time: true,
          end_time: true,
          name: true,
        },
      },
      seats: {
        select: {
          id: true,
          status: true,
          price: true,
          seat: {
            select: {
              id: true,
              seat_number: true,
              row: true,
              col: true,
            },
          },
        },
        orderBy: {
          seat: {
            row: "asc",
          },
        },
      },
    },
  });

  if (!showtime) return null;

  // Group seats by row
  const grouped: Record<string, any[]> = {};
  for (const s of showtime.seats) {
    const row = s.seat.row;
    if (!grouped[row]) grouped[row] = [];
    grouped[row].push({
      id: s.id,
      status: s.status,
      price: s.price,
      seat_id: s.seat.id,
      seat_number: s.seat.seat_number,
      row: s.seat.row,
      col: s.seat.col,
    });
  }

  // Convert to array of rows and sort
  const rows = Object.keys(grouped)
    .sort() // เรียงตาม row A, B, C...
    .map((row) => ({
      row,
      seats: grouped[row].sort((a, b) => {
        const numA = parseInt(a.seat_number.replace(/\D/g, ""), 10);
        const numB = parseInt(b.seat_number.replace(/\D/g, ""), 10);
        return numA - numB;
      }),
    }));

  return {
    ...showtime,
    seats: rows,
  };
};

export const isShowtimeExists = (
  hall: string,
  timeSlot: string,
  date: string
) => {
  return prisma.showtime.findFirst({
    where: {
      hall_id: hall,
      time_slot_id: timeSlot,
      date: new Date(date),
    },
  });
};

export const createShowTime = (showTime: CreateShowTimeData) => {
  return prisma.showtime.create({
    data: {
      movie_id: showTime.movie,
      hall_id: showTime.hall,
      time_slot_id: showTime.timeSlot,
      date: new Date(showTime.date),
      price: parseFloat(showTime.price.toString()),
    },
  });
};
