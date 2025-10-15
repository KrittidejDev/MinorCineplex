import { PrismaClient } from "@/generated/prisma";
import {
  CreateShowTimeData,
  UpdateShowTimeData,
  ShowTimeFilter,
} from "../services/showTimeService";

const prisma = new PrismaClient();

export const getManyForAdmin = async ({
  limit,
  movie,
  cinema,
  hall,
  timeSlot,
  date,
  page,
}: ShowTimeFilter) => {
  let dateFilter = undefined;
  if (date) {
    // ใช้ local time เพื่อหลีกเลี่ยง timezone offset
    const dateStr = date;
    const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

    dateFilter = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }
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
    ...(dateFilter && { date: dateFilter }),
  };

  const total = await prisma.showtime.count({ where });

  const data = await prisma.showtime.findMany({
    take: limit,
    skip: ((page || 1) - 1) * (limit || 10),
    where,
    select: {
      id: true,
      date: true,
      movie: {
        select: {
          id: true,
          title: true,
        },
      },
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
      time_slot: {
        select: {
          id: true,
          start_time: true,
          end_time: true,
        },
      },
      price: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return { data, total };
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
  const grouped: Record<
    string,
    Array<{
      id: string;
      status: string;
      price: number | null;
      seat_id: string;
      seat_number: string;
      row: string;
      col: string;
    }>
  > = {};
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
  hall_id: string,
  time_slot_id: string,
  date: string,
  excludeId?: string
) => {
  return prisma.showtime.findFirst({
    where: {
      hall_id: hall_id,
      time_slot_id: time_slot_id,
      date: new Date(`${date}T00:00:00.000Z`),
      ...(excludeId && { id: { not: excludeId } }),
    },
  });
};

export const createShowTime = async (showTime: CreateShowTimeData) => {
  // เริ่ม transaction เพื่อสร้าง showtime และ seats พร้อมกัน
  return await prisma.$transaction(async (tx) => {
    // สร้าง showtime
    const newShowtime = await tx.showtime.create({
      data: {
        movie_id: showTime.movie_id,
        hall_id: showTime.hall_id,
        time_slot_id: showTime.time_slot_id,
        date: new Date(`${showTime.date}T00:00:00.000Z`),
        price: parseFloat(showTime.price.toString()),
      },
    });

    // ดึง seats ทั้งหมดจาก hall
    const hallSeats = await tx.seat.findMany({
      where: { hall_id: showTime.hall_id },
    });

    // สร้าง showtime_seat สำหรับทุก seat ใน hall
    const showtimeSeats = hallSeats.map((seat) => ({
      showtime_id: newShowtime.id,
      seat_id: seat.id,
      status: "AVAILABLE",
      price: parseFloat(showTime.price.toString()),
    }));

    await tx.showtime_seat.createMany({
      data: showtimeSeats,
    });

    return newShowtime;
  });
};

export const deleteShowTimeById = (id: string) => {
  return prisma.showtime.delete({
    where: { id },
  });
};

export const updateShowTimeById = async (
  id: string,
  showTime: UpdateShowTimeData
) => {
  return await prisma.$transaction(async (tx) => {
    // อัปเดต showtime
    const updatedShowtime = await tx.showtime.update({
      where: { id },
      data: {
        movie_id: showTime.movie_id,
        hall_id: showTime.hall_id,
        time_slot_id: showTime.time_slot_id,
        date: new Date(`${showTime.date}T00:00:00.000Z`),
        price: parseFloat(showTime.price.toString()),
      },
    });

    // ถ้า hall เปลี่ยน ให้อัปเดต seats
    const currentShowtime = await tx.showtime.findUnique({
      where: { id },
      include: { seats: true },
    });

    if (currentShowtime && currentShowtime.hall_id !== showTime.hall_id) {
      // ลบ seats เก่า
      await tx.showtime_seat.deleteMany({
        where: { showtime_id: id },
      });

      // ดึง seats ใหม่จาก hall ใหม่
      const hallSeats = await tx.seat.findMany({
        where: { hall_id: showTime.hall_id },
      });

      // สร้าง showtime_seat ใหม่
      const showtimeSeats = hallSeats.map((seat) => ({
        showtime_id: id,
        seat_id: seat.id,
        status: "AVAILABLE",
        price: parseFloat(showTime.price.toString()),
      }));

      await tx.showtime_seat.createMany({
        data: showtimeSeats,
      });
    } else {
      // อัปเดต price ของ seats ที่มีอยู่
      await tx.showtime_seat.updateMany({
        where: { showtime_id: id },
        data: { price: parseFloat(showTime.price.toString()) },
      });
    }

    return updatedShowtime;
  });
};

export const getTimeSlotById = (id: string) => {
  return prisma.time_slot.findUnique({
    where: { id },
  });
};
