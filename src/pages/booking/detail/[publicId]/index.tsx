import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

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

const BookingDetail: React.FC = () => {
  const router = useRouter();
  const { publicId, locale } = router.query; // ดึง publicId และ locale จาก URL
  const { t, i18n } = useTranslation("common");
  const lang = (locale || i18n.language || "en") as "th" | "en"; // ใช้ locale จาก router.query แทน t("lang")
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const bookingSlug = `${bookingData?.movie_title?.en}-${bookingData?.cinema_name?.en}-${bookingData?.hall?.en}`;

  const fetchBookingData = async (id: string) => {
    try {
      const response = await axios.get(`/api/booking/success/${id}`);
      if (response.data.success) {
        setBookingData(response.data.data);
      } else {
        setError(response.data.message || t("error_fetch_data"));
      }
    } catch (err) {
      setError(t("error_fetch_booking"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = Array.isArray(publicId) ? publicId[0] : publicId;
    if (id) {
      fetchBookingData(id);
    } else {
      setError(t("error_no_booking_id"));
      setLoading(false);
    }
  }, [publicId, t]);

  if (loading) {
    return (
      <NavAndFooter>
        <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
          <div className="text-white text-2xl">{t("loading")}</div>
        </div>
      </NavAndFooter>
    );
  }

  if (error) {
    return (
      <NavAndFooter>
        <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
          <div className="text-red-500 text-2xl">{error}</div>
        </div>
      </NavAndFooter>
    );
  }

  if (!bookingData) {
    return (
      <NavAndFooter>
        <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
          <div className="text-white text-2xl">{t("error_not_found")}</div>
        </div>
      </NavAndFooter>
    );
  }
console.log(bookingData);
  return (
    <NavAndFooter
      seoProps={{
        title: `${
          bookingData.movie_title[lang] || bookingData.movie_title.en
        } - ${bookingData.cinema_name[lang] || bookingData.cinema_name.en} `,
        description:
          bookingData.movie_description[lang] ||
          bookingData.movie_description.en ||
          "Booking details for your movie ticket",
        image: bookingData.movie_poster || "/images/fallback-poster.jpg",
        imageWidth: 800,
        imageHeight: 1200,
        imageAlt: bookingData.movie_title[lang] || "Movie Poster",
        url: `https://minor-cineplex-phi.vercel.app/booking/${bookingSlug}?id=${bookingData.showtime_id}&fid=${bookingData.user_id}`,
        type: "website",
        customMetaTags: [
          {
            name: "keywords",
            content: `${
              bookingData.movie_title[lang] || bookingData.movie_title.en
            }, ${bookingData.genres.map((g) => g[lang] || g.en).join(", ")}, ${
              bookingData.cinema_name[lang] || bookingData.cinema_name.en
            }, Booking, Movie`,
          },
        ],
      }}
    >
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-6 md:mb-8">
            {t("Booking Detail")}
          </h1>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <HoverCard3D>
              <div className="w-full md:min-w-[387px] md:max-w-[387px] md:flex-shrink-0">
                <div className="relative w-full md:w-fit mx-auto md:mx-0">
                  <div className="w-full aspect-[280/408] md:aspect-[387/565] md:min-w-[387px] md:max-w-[387px] md:min-h-[565px] md:max-h-[565px] rounded-lg overflow-hidden shadow-2xl shadow-cyan-500/30 relative">
                    <Image
                      src={
                        bookingData.movie_poster ||
                        "/images/fallback-poster.jpg"
                      }
                      alt={bookingData.movie_title[lang] || "Movie Poster"}
                      fill
                      sizes="(max-width: 768px) 100vw, 387px"
                      className="object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/images/fallback-poster.jpg";
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
                    {bookingData.movie_title[lang] ||
                      bookingData.movie_title.en ||
                      bookingData.movie_title.th}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {bookingData.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="flex items-center px-3 min-h-[32px] bg-[#21263F] text-[#8B93B0] rounded text-sm"
                      >
                        {genre[lang] ||
                          genre.en ||
                          genre.th ||
                          t("unknown_genre")}
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
                    <span>
                      {bookingData.cinema_name[lang] ||
                        bookingData.cinema_name.en ||
                        bookingData.cinema_name.th}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DateRangeFill color="#565F7E" />
                    <span>
                      {bookingData.date[lang] ||
                        bookingData.date.en ||
                        bookingData.date.th}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TimeFill color="#565F7E" />
                    <span>{bookingData.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shop color="#565F7E" />
                    <span>
                      {bookingData.hall[lang] ||
                        bookingData.hall.en ||
                        bookingData.hall.th}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-4">
                  <button className="bg-gray-g63f text-gray-gedd font-fm-16 rounded-sm px-4 py-3">
                    {bookingData.seats.length}{" "}
                    {t(bookingData.seats.length > 1 ? "tickets" : "ticket")}
                  </button>
                  <div className="px-4 py-2">
                    <span className="text-slate-300 text-sm md:text-base">
                      {t("selected_seat")}
                    </span>
                  </div>
                  <div className="px-4 py-2">
                    <span className="text-white font-semibold text-sm md:text-base">
                      {bookingData.seats.join(", ") || t("no_seats")}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 text-[#C8CEDD] text-sm md:text-base">
                  <div className="flex items-center gap-3">
                    <span className="w-32">{t("payment_method")}</span>
                    <span className="font-bold text-white">
                      {bookingData.payment_method[lang] ||
                        bookingData.payment_method.en ||
                        bookingData.payment_method.th}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-32">{t("total")}</span>
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const resolvedLocale = locale || "en";
  return {
    props: {
      ...(await serverSideTranslations(resolvedLocale, ["common"])),
    },
  };
};

export default BookingDetail;
