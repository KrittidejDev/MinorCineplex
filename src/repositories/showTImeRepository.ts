import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const getMany = (movie_id: string) => {
  return prisma.showtime.findMany({
    where: { movie_id },
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
          release_date: true,
          description: true,
        },
      },
      hall: {
        select: {
          id: true,
          name: true,
          cinema: true,
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
