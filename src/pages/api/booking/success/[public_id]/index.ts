import { NextApiRequest, NextApiResponse } from "next";
import { format } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { Prisma, PrismaClient } from "@/generated/prisma";

interface Translations {
  th?: { name?: string; title?: string; description?: string };
  en?: { name?: string; title?: string; description?: string };
}

interface BookingSuccessResponse {
  success: boolean;
  data?: {
    cinema_name: { th: string; en: string };
    movie_title: { th: string; en: string };
    movie_description: { th: string | null; en: string | null };
    movie_poster: string | null;
    genres: { th: string | null; en: string | null }[];
    languages: string[];
    date: { th: string; en: string };
    time: string;
    hall: { th: string; en: string };
    seats: string[];
    payment_method: { th: string; en: string };
    total_price: number;
    user_id: string;
    showtime_id: string;
  };
  message?: string;
}

function parseTranslations(
  json: Prisma.JsonValue | null | undefined
): Translations {
  const result: Translations = {};
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    console.warn("Invalid translations format:", json);
    return result;
  }
  if (
    "th" in json &&
    json.th &&
    typeof json.th === "object" &&
    !Array.isArray(json.th)
  ) {
    result.th = {
      name: typeof json.th.name === "string" ? json.th.name : undefined,
      title: typeof json.th.title === "string" ? json.th.title : undefined,
      description:
        typeof json.th.description === "string"
          ? json.th.description
          : undefined,
    };
  }
  if (
    "en" in json &&
    json.en &&
    typeof json.en === "object" &&
    !Array.isArray(json.en)
  ) {
    result.en = {
      name: typeof json.en.name === "string" ? json.en.name : undefined,
      title: typeof json.en.title === "string" ? json.en.title : undefined,
      description:
        typeof json.en.description === "string"
          ? json.en.description
          : undefined,
    };
  }
  return result;
}

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BookingSuccessResponse>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "เฉพาะเมธอด GET เท่านั้น" });
  }

  const { public_id } = req.query as { public_id: string };

  if (!public_id || typeof public_id !== "string" || public_id.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "ต้องระบุ public_id ที่ถูกต้อง" });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { public_id },
      select: {
        status: true,
        total_price: true,
        user_id: true,
        showtime: {
          select: {
            id: true,
            date: true,
            time_slot: { select: { start_time: true } },
            cinema: { select: { name: true, translations: true } },
            hall: { select: { name: true } },
            movie: {
              select: {
                title: true,
                translations: true,
                poster_url: true,
                genres: {
                  select: {
                    genre: { select: { name: true, translations: true } },
                  },
                },
                languages: {
                  select: { language: { select: { name: true } } },
                },
              },
            },
          },
        },
        seats: {
          select: {
            showtime_seat: {
              select: { seat_template: { select: { seat_number: true } } },
            },
          },
        },
        payment: { select: { payment_method: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "ไม่พบการจอง" });
    }

    if (booking.status !== "PAID") {
      return res
        .status(400)
        .json({ success: false, message: "การจองนี้ยังไม่ได้รับการชำระเงิน" });
    }

    // แปลงข้อมูลการแปล
    const cinemaTranslations = parseTranslations(
      booking.showtime.cinema.translations
    );
    const movieTranslations = parseTranslations(
      booking.showtime.movie.translations
    );

    // จัดรูปแบบวันที่
    const dateTh = format(new Date(booking.showtime.date), "dd MMM yyyy", {
      locale: th,
    });
    const dateEn = format(new Date(booking.showtime.date), "dd MMM yyyy", {
      locale: enUS,
    });

    // ข้อมูลที่ส่งกลับ
    const responseData: BookingSuccessResponse["data"] = {
      cinema_name: {
        th: cinemaTranslations.th?.name || booking.showtime.cinema.name,
        en: cinemaTranslations.en?.name || booking.showtime.cinema.name,
      },
      movie_title: {
        th: movieTranslations.th?.title || booking.showtime.movie.title,
        en: movieTranslations.en?.title || booking.showtime.movie.title,
      },
      movie_description: {
        th: movieTranslations.th?.description || null,
        en: movieTranslations.en?.description || null,
      },
      movie_poster: booking.showtime.movie.poster_url || null,
      genres: booking.showtime.movie.genres.map(({ genre }) => {
        const genreTranslations = parseTranslations(genre.translations);
        return {
          th: genreTranslations.th?.name || genre.name,
          en: genreTranslations.en?.name || genre.name,
        };
      }),
      languages: booking.showtime.movie.languages.map(
        ({ language }) => language.name
      ),
      date: { th: dateTh, en: dateEn },
      time: booking.showtime.time_slot.start_time,
      hall: {
        th: booking.showtime.hall.name,
        en: booking.showtime.hall.name,
      },
      seats: booking.seats.map(
        (seat) => seat.showtime_seat.seat_template.seat_number
      ),
      payment_method: {
        th:
          booking.payment?.payment_method === "CREDIT_CARD"
            ? "บัตรเครดิต"
            : "คิวอาร์โค้ด",
        en:
          booking.payment?.payment_method === "CREDIT_CARD"
            ? "Credit Card"
            : "QR Code",
      },
      total_price: booking.total_price,
      user_id: booking.user_id,
      showtime_id: booking.showtime.id,
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดใน API Booking Success:", error);
    res
      .status(500)
      .json({ success: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  } finally {
    await prisma.$disconnect();
  }
}
