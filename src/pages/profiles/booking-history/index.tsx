import React, { useEffect, useState } from "react";
import NavBarWidget from "@/components/Widgets/NavBarWidget";
import ProfileBar from "@/components/Widgets/ProfileBar";
import { useTranslation } from "react-i18next";
import { BookingCard } from "@/components/Cards/bookkingCard";
import { useSession } from "next-auth/react";
import axios from "axios";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface Booking {
  id: string;
  movieTitle: string;
  moviePoster: string | null;
  location: string;
  date: string;
  time: string;
  hall: string;
  bookingNumber: string;
  bookedDate: string;
  selectedSeats: string;
  ticketCount: number;
  paymentMethod: string;
  isPaid: boolean;
}

const Index = () => {
  const { t, i18n } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/booking/history/${userId}`);
      const data = response.data;
      console.log("res booking", data);
      if (!data.success) {
        throw new Error(data.message || t("error"));
      }
      const formattedBookings: Booking[] = data.data.map((booking: any) => ({
        id: booking.booking_id,
        movieTitle:
          i18n.language === "th"
            ? booking.movie_title.th
            : booking.movie_title.en,
        moviePoster:
          booking.movie_poster || "https://via.placeholder.com/97x140",
        location:
          i18n.language === "th"
            ? `${booking.cinema_name.th} ${booking.showtime?.cinema?.city || ""}`
            : `${booking.cinema_name.en} ${
                booking.showtime?.cinema?.city_en ||
                booking.showtime?.cinema?.city ||
                ""
              }`,
        date: i18n.language === "th" ? booking.date.th : booking.date.en,
        time: booking.time,
        hall: i18n.language === "th" ? booking.hall.th : booking.hall.en,
        bookingNumber: booking.public_id,
        bookedDate:
          i18n.language === "th"
            ? booking.booked_date.th
            : booking.booked_date.en,
        selectedSeats: booking.seats.join(", "),
        ticketCount: booking.seats.length,
        paymentMethod:
          i18n.language === "th"
            ? booking.payment_method.th
            : booking.payment_method.en,
        isPaid: booking.is_paid,
      }));

      setBookings(formattedBookings);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || t("error");

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchBookings();
  }, [userId, i18n.language, t]);

  console.log("BOOKING HIS DATA", bookings);

  return (
    <div className="bg-blue-b flex flex-col">
      <NavBarWidget />
      <div
        className="w-full min-w-screen flex flex-col md:flex-row max-w-[1129px] items-start gap-6 lg:gap-12 top-21 
        py-10 md:pl-20 md:py-15 xl:pl-56"
      >
        <div className="w-full md:max-w-[257px]">
          <ProfileBar />
        </div>

        <div className="flex flex-col px-4 gap-6 md:gap-6 justify-start items-start w-full md:max-w-[691px]">
          <div className="flex flex-col gap-5 w-full">
            <div className="text-f-36 text-white">{t("bookingHistory")}</div>
            {loading ? (
              <div className="text-white">{t("loading")}</div>
            ) : error ? (
              <div className="text-white">{error}</div>
            ) : bookings.length === 0 ? (
              <div className="text-white">{t("noBookings")}</div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="w-full">
                  <BookingCard
                    movieTitle={booking.movieTitle}
                    moviePoster={booking.moviePoster}
                    location={booking.location}
                    date={booking.date}
                    time={booking.time}
                    hall={booking.hall}
                    bookingNumber={booking.bookingNumber}
                    bookedDate={booking.bookedDate}
                    selectedSeats={booking.selectedSeats}
                    ticketCount={booking.ticketCount}
                    paymentMethod={booking.paymentMethod}
                    isPaid={booking.isPaid}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const resolvedLocale = locale || "en";
  return {
    props: {
      ...(await serverSideTranslations(resolvedLocale, ["bookingDetail"])),
    },
  };
};

export default Index;
