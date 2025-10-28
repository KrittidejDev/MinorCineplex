import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import React from "react";
import PinFill from "@/components/Icons/PinFill";
import DateRangeFill from "@/components/Icons/DateRangeFill";
import TimeFill from "@/components/Icons/TimeFill";
import Shop from "@/components/Icons/Shop";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HoverCard3D } from "@/components/Displays/HoverCard3D";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import axios from "axios";

interface BookingData {
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
}

interface BookingDetailProps {
  bookingData: BookingData | null;
  error: string | null;
}

const BASE_URL = "https://minor-cineplex-phi.vercel.app";

const BookingDetail: React.FC<BookingDetailProps> = ({
  bookingData,
  error,
}) => {
  const { t, i18n } = useTranslation("common");
  const lang = (i18n.language || "en") as "th" | "en";

  if (error) {
    return (
      <NavAndFooter>
        <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
          <div className="text-white text-2xl">{error}</div>
        </div>
      </NavAndFooter>
    );
  }

  if (!bookingData) {
    return (
      <NavAndFooter>
        <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
          <div className="text-white text-2xl">{t("Booking not found")}</div>
        </div>
      </NavAndFooter>
    );
  }

  const absoluteImage = bookingData.movie_poster
    ? bookingData.movie_poster.startsWith("http")
      ? bookingData.movie_poster
      : `${BASE_URL}${bookingData.movie_poster.startsWith("/") ? "" : "/"}${bookingData.movie_poster}`
    : `${BASE_URL}/images/fallback-poster.jpg`;

  const currentUrl = `${BASE_URL}/booking/detail/booking-${bookingData.showtime_id}`;

  const bookingSlug =
    `${bookingData.movie_title.en}-${bookingData.cinema_name.en}-${bookingData.hall.en}`
      .replace(/\s+/g, "-")
      .toLowerCase();

  return (
    <NavAndFooter
      seoProps={{
        title: `${bookingData.movie_title[lang]} - ${bookingData.cinema_name[lang]} | MinorCineplex`,
        description:
          bookingData.movie_description[lang] ||
          `จองตั๋วภาพยนตร์ ${bookingData.movie_title[lang]} เรียบร้อยแล้ว วันที่ ${bookingData.date[lang]} รอบ ${bookingData.time} ที่นั่ง ${bookingData.seats.join(", ")}`,
        image: absoluteImage,
        imageWidth: 800,
        imageHeight: 1200,
        imageAlt: `${bookingData.movie_title[lang]} - โปสเตอร์ภาพยนตร์`,
        url: currentUrl,
        type: "website",
        siteName: "MinorCineplex",
      }}
    >
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-6 md:mb-8">
            {t("Booking Detail")}
          </h1>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <HoverCard3D>
              <div className="w-full md:min-w-[387px] md:max-w-[387px]">
                <div className="relative w-full">
                  <div className="w-full aspect-[280/408] md:aspect-[387/565] rounded-lg overflow-hidden shadow-2xl shadow-cyan-500/30 relative">
                    <Image
                      src={absoluteImage}
                      alt={bookingData.movie_title[lang] || "Movie Poster"}
                      fill
                      className="object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `${BASE_URL}/images/fallback-poster.jpg`;
                      }}
                    />
                  </div>
                </div>
              </div>
            </HoverCard3D>

            <div className="flex-1 rounded-lg p-5 md:p-8 bg-[#070C1BB2]">
              <div className="space-y-5 md:space-y-6">
                <div>
                  <h2 className="text-[#FFFFFF] text-2xl md:text-4xl font-bold mb-3">
                    {bookingData.movie_title[lang]}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {bookingData.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="flex items-center px-3 min-h-[32px] bg-[#21263F] text-[#8B93B0] rounded text-sm"
                      >
                        {genre[lang] || t("Unknown genre")}
                      </span>
                    ))}
                    {bookingData.languages.map((language, index) => (
                      <span
                        key={index}
                        className="flex items-center px-3 min-h-[32px] bg-[#21263F] text-[#C8CEDD] rounded text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 text-[#C8CEDD] text-sm md:text-base">
                  <div className="flex items-center gap-3">
                    <PinFill color="#565F7E" />
                    <span>{bookingData.cinema_name[lang]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DateRangeFill color="#565F7E" />
                    <span>{bookingData.date[lang]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TimeFill color="#565F7E" />
                    <span>{bookingData.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shop color="#565F7E" />
                    <span>{bookingData.hall[lang]}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button className="bg-gray-g63f text-gray-gedd rounded-sm px-4 py-3">
                    {bookingData.seats.length}{" "}
                    {t(bookingData.seats.length > 1 ? "tickets" : "ticket")}
                  </button>
                  <div className="px-4 py-2">
                    <span className="text-slate-300 text-sm md:text-base">
                      {t("Seats:")}
                    </span>
                  </div>
                  <div className="px-4 py-2">
                    <span className="text-white font-semibold text-sm md:text-base">
                      {bookingData.seats.join(", ") || t("No seats")}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-[#C8CEDD] text-sm md:text-base">
                  <div className="flex items-center gap-3">
                    <span className="w-32">{t("Payment Method")}</span>
                    <span className="font-bold text-white">
                      {bookingData.payment_method[lang]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-32">{t("Total")}</span>
                    <span className="font-bold text-white">
                      ฿{bookingData.total_price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/booking/${bookingSlug}?id=${bookingData.showtime_id}&fid=${bookingData.user_id}`}
                >
                  <Button className="btn-base blue-normal mt-4 md:mt-6 mb-4 md:mb-10">
                    {t("Book more seats")}
                  </Button>
                </Link>

                {bookingData.movie_description[lang] && (
                  <div className="space-y-4 pt-4 md:pt-10 border-t border-[#21263F]/50">
                    <p className="text-[#C8CEDD] leading-relaxed text-sm md:text-base">
                      {bookingData.movie_description[lang]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavAndFooter>
  );
};

export default BookingDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );

  const { params, locale } = context;
  const publicId = Array.isArray(params?.publicId)
    ? params?.publicId[0]
    : params?.publicId;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://minor-cineplex-phi.vercel.app";

  try {
    const res = await axios.get(
      `${baseUrl}/api/booking/success/${encodeURIComponent(publicId as string)}`
    );

    return {
      props: {
        bookingData: res.data?.data || null,
        error: res.data?.success ? null : "ไม่พบข้อมูลการจอง",
        ...(await serverSideTranslations(locale || "en", ["common"])),
      },
    };
  } catch (err: unknown) {
    console.error(
      "[getServerSideProps] booking fetch error:",
      err instanceof Error ? err.message : err
    );
    return {
      props: {
        bookingData: null,
        error: "เกิดข้อผิดพลาดในการโหลดข้อมูลจากเซิร์ฟเวอร์",
        ...(await serverSideTranslations(locale || "en", ["common"])),
      },
    };
  }
};
