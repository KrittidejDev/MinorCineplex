import React, { useEffect, useState } from "react";
import NavBarWidget from "@/components/Widgets/NavBarWidget";
import ProfileBar from "@/components/Widgets/ProfileBar";
import { useTranslation } from "next-i18next";
import { BookingCard } from "@/components/Cards/bookkingCard";
import { useSession } from "next-auth/react";
import axios from "axios";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ModalEmpty from "@/components/Modals/ModalEmpty";
import BookingDetailModal from "@/components/Modals/BookingDetailModal";
import { BookingAPIResponse } from "@/types/booking";
import { toast } from "react-toastify";
import { BookingStatus } from "@/types/booking";
import { useRouter } from "next/router";

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
  status: BookingStatus;
  totalPrice: number;
  couponDiscount: number;
}

const Index = () => {
  const { t, i18n } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/booking/history/${userId}`);
      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || t("error"));
      }
      const formattedBookings: Booking[] = data.data.map(
        (booking: BookingAPIResponse) => ({
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
          totalPrice: booking.total_price,
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
          status: booking.status as BookingStatus,
        })
      );

      setBookings(formattedBookings);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? (err.message as string)
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || t("error");

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchBookings();
  }, [userId, i18n.language, t]);

  const handleClickBooking = (bookId: string) => {
    const booking = bookings.find((b) => b.id === bookId);
    if (booking) {
      setSelectedBooking(booking);
      setModal(true);
    }
  };

  const handleCancelBooking = async (bookId: string) => {
    try {
      await axios.patch(`/api/booking/update-status/${bookId}`, {
        status: "CANCELLED",
      });
      toast.success(t("Booking cancelled successfully") as string);
      router.push("/profiles/booking-history/cancel-success");
    } catch (err) {
      console.error("เกิดข้อผิดพลาดใน API Cancel Booking:", err);
      toast.error(t("Booking cancelled failed") as string);
      setModal(false);
    }
  };

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
            <div className="text-f-36 text-white">{t("Booking history")}</div>
            {loading ? (
              <div className="text-white">{t("loading")}</div>
            ) : error ? (
              <div className="text-white">{error}</div>
            ) : bookings.length === 0 ? (
              <div className="text-white">{t("No bookings found")}</div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="w-full hover:cursor-pointer"
                  onClick={() => handleClickBooking(booking.id)}
                >
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
                    status={booking.status}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {selectedBooking && (
        <ModalEmpty isShowModal={modal} onClose={() => setModal(false)}>
          <BookingDetailModal
            movieTitle={selectedBooking.movieTitle}
            moviePoster={selectedBooking.moviePoster}
            location={selectedBooking.location}
            date={selectedBooking.date}
            time={selectedBooking.time}
            hall={selectedBooking.hall}
            bookingNumber={selectedBooking.bookingNumber}
            bookedDate={selectedBooking.bookedDate}
            selectedSeats={selectedBooking.selectedSeats}
            ticketCount={selectedBooking.ticketCount}
            paymentMethod={selectedBooking.paymentMethod}
            status={selectedBooking.status}
            totalPrice={selectedBooking.totalPrice}
            couponDiscount={selectedBooking.couponDiscount}
            onClose={() => setModal(false)}
            onCancelBooking={() =>
              handleCancelBooking(selectedBooking.id as string)
            }
          />
        </ModalEmpty>
      )}
    </div>
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

export default Index;
