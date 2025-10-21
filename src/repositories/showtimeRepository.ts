import { PrismaClient } from "@/generated/prisma";
import { ShowTimeFilter } from "@/services/showTimeService";

interface CreateShowtimeData {
    movie_id: string;
    hall_id: string;
    cinema_id: string;
    time_slot_id: string;
    date: Date;
    price: number;
}

interface UpdateShowtimeData {
    movie_id: string;
    hall_id: string;
    cinema_id: string;
    time_slot_id: string;
    date: Date;
    price: number;
}

interface WhereClause {
    movie_id?: string;
    cinema_id?: string;
    hall_id?: string;
    time_slot_id?: string;
    date?: {
        gte?: Date;
        lte?: Date;
    };
}

const prisma = new PrismaClient();

export const getManyForAdmin = async ({
    limit = 10,
    movie,
    cinema,
    hall,
    timeSlot,
    date,
    page = 1,
}: ShowTimeFilter) => {
    const whereClause: WhereClause = {};
    
    if (movie) whereClause.movie_id = movie;
    if (cinema) whereClause.cinema_id = cinema;
    if (hall) whereClause.hall_id = hall;
    if (timeSlot) whereClause.time_slot_id = timeSlot;
    
    if (date) {
        const dateStr = new Date(date).toISOString().split('T')[0];
        const startOfDay = new Date(dateStr + "T00:00:00.000Z");
        const endOfDay = new Date(dateStr + "T23:59:59.999Z");      
        whereClause.date = {
            gte: startOfDay,
            lte: endOfDay
        };
    }

    const [showtimes, total] = await Promise.all([
        prisma.showtime.findMany({
            take: limit,
            skip: (page - 1) * limit,
            where: whereClause,
            include: {
                movie: true,
                cinema: true,
                hall: true,
                time_slot: true,
            },
            orderBy: {
                date: 'asc',
            },
        }),
        prisma.showtime.count({
            where: whereClause,
        })
    ]);

    return {
        showtimes,
        total,
    };
}

export const isShowtimeExists = async (hall_id: string, time_slot_id: string, date: Date, excludeId?: string) => {
    const whereClause: Record<string, string | Date | { not: string }> = {
        hall_id,
        time_slot_id,
        date,
    };
    if (excludeId) {
        whereClause.id = { not: excludeId };
    }
    const showtime = await prisma.showtime.findFirst({
        where: whereClause,
    });
    return showtime;
}

export const createShowtime = async (showtime: CreateShowtimeData) => {
    const newShowtime = await prisma.showtime.create({
        data: showtime,
    });
    return newShowtime;
}

export const updateShowtimeById = async (id: string, showtime: UpdateShowtimeData) => {
    console.log("showtime", showtime);
    const updatedShowtime = await prisma.showtime.update({
        where: { id },
        data: showtime,
    });
    return updatedShowtime;
}

export const getShowtimeById = async (id: string) => {
    const showtime = await prisma.showtime.findUnique({
        where: { id },
    });
    return showtime;
}

export const deleteShowtimeById = async (id: string) => {
    const deletedShowtime = await prisma.showtime.delete({
        where: { id },
    });
    return deletedShowtime;
}


export const createShowtimeSeats = async (showtimeId: string) => {
    const seatTemplates = await prisma.seatTemplate.findMany({
        orderBy: [
            { row: 'asc' },
            { col: 'asc' }
        ]
    });
    const showtimeSeats = await prisma.showtimeSeat.createMany({
        data: seatTemplates.map(template => ({
            showtime_id: showtimeId,
            seat_template_id: template.id,
            status: 'AVAILABLE',
            price: null,
        }))
    });
    
    return showtimeSeats;
}
