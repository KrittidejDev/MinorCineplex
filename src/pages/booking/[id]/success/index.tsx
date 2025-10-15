// pages/booking/[id]/success/index.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";
import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, MapPin, Ticket } from "lucide-react";
import Image from "next/image";

interface BookingDetail {
  id: string;
  user_id: string;
  showtime_id: string;
  status: string;
  total_price: number;
  created_at: string;
  showtime: {
    id: string;
    date: string;
    price: number;
    movie: {
      id: string;
      title: string;
      title_en: string;
      poster_url: string;
      duration_min: number;
      rating: string;
      genre: string;
    };
    hall: {
      id: string;
      name: string;
      cinema: {
        id: string;
        name: string;
        name_en: string;
        address: string;
      };
    };
    time_slot: {
      id: string;
      name: string;
      start_time: string;
      end_time: string;
    };
  };
  seats: Array<{
    id: string;
    seat: {
      id: string;
      seat_number: string;
      row: string;
      col: string;
    };
    price: number;
  }>;
}

const BookingSuccessPage = () => {
  const router = useRouter();
  const { id } = router.query;
  // const { data: session } = useSession();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const fetchBookingDetail = async () => {
      try {
        const response = await fetch(`/api/booking/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch booking details");
        }
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error("Error fetching booking:", error);
        setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <NavAndFooter>
        <div className="flex justify-center items-center min-h-screen bg-gray-gc1b">
          <div className="text-white text-xl">กำลังโหลด...</div>
        </div>
      </NavAndFooter>
    );
  }

  if (error || !booking) {
    return (
      <NavAndFooter>
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-gc1b gap-4">
          <div className="text-white text-xl">
            {error || "ไม่พบข้อมูลการจอง"}
          </div>
          <Button
            className="btn-base blue-normal"
            onClick={() => router.push("/")}
          >
            กลับหน้าหลัก
          </Button>
        </div>
      </NavAndFooter>
    );
  }

  return (
    <NavAndFooter>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="bg-gray-g63f rounded-2xl p-8 mb-6 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              จองตั๋วสำเร็จ!
            </h1>
            <p className="text-gray-gedd mb-4">ขอบคุณที่ใช้บริการ</p>
            <div className="inline-block bg-gray-800 px-6 py-3 rounded-lg">
              <p className="text-sm text-gray-gedd mb-1">หมายเลขการจอง</p>
              <p className="text-xl font-mono font-bold text-white">
                {booking.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-g63f rounded-2xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
              รายละเอียดการจอง
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Movie Poster */}
              <div className="flex justify-center">
                {booking.showtime.movie.poster_url ? (
                  <Image
                    src={booking.showtime.movie.poster_url}
                    alt={booking.showtime.movie.title}
                    width={300}
                    height={450}
                    className="w-full max-w-sm rounded-lg shadow-lg"
                    priority
                  />
                ) : (
                  <div className="w-full max-w-sm aspect-[2/3] bg-gray-700 rounded-lg flex items-center justify-center">
                    <Ticket className="w-20 h-20 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {booking.showtime.movie.title}
                  </h3>
                  {booking.showtime.movie.title_en && (
                    <p className="text-lg text-gray-gedd mb-2">
                      {booking.showtime.movie.title_en}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {booking.showtime.movie.rating && (
                      <span className="px-3 py-1 bg-gray-700 text-white text-sm rounded-full">
                        {booking.showtime.movie.rating}
                      </span>
                    )}
                    {booking.showtime.movie.genre && (
                      <span className="px-3 py-1 bg-gray-700 text-white text-sm rounded-full">
                        {booking.showtime.movie.genre}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-gray-700 text-white text-sm rounded-full">
                      {booking.showtime.movie.duration_min} นาที
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-gedd text-sm">โรงภาพยนตร์</p>
                      <p className="text-white font-medium">
                        {booking.showtime.hall.cinema.name}
                      </p>
                      <p className="text-gray-gedd text-sm mt-1">
                        {booking.showtime.hall.cinema.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-gedd text-sm">โรงฉาย</p>
                      <p className="text-white font-medium">
                        {booking.showtime.hall.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-gedd text-sm">วันที่</p>
                      <p className="text-white font-medium">
                        {formatDate(booking.showtime.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-gedd text-sm">เวลา</p>
                      <p className="text-white font-medium">
                        {formatTime(booking.showtime.time_slot.start_time)} -{" "}
                        {formatTime(booking.showtime.time_slot.end_time)} น.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seats Information */}
          <div className="bg-gray-g63f rounded-2xl p-8 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">ที่นั่ง</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {booking.seats.map((seat) => (
                <div
                  key={seat.id}
                  className="bg-gray-700 p-4 rounded-lg text-center"
                >
                  <p className="text-2xl font-bold text-white mb-1">
                    {seat.seat.seat_number}
                  </p>
                  <p className="text-sm text-gray-gedd">
                    แถว {seat.seat.row} ที่ {seat.seat.col}
                  </p>
                  <p className="text-sm text-blue-400 mt-2">
                    ฿{formatPrice(seat.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-g63f rounded-2xl p-8 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">สรุปราคา</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-gedd">
                <span>จำนวนที่นั่ง</span>
                <span>{booking.seats.length} ที่นั่ง</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between">
                <span className="text-xl font-bold text-white">
                  ยอดรวมทั้งหมด
                </span>
                <span className="text-2xl font-bold text-blue-500">
                  ฿{formatPrice(booking.total_price)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-gedd">สถานะการชำระเงิน</span>
                <span className="text-green-500 font-medium">ชำระเงินแล้ว</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="btn-base blue-normal"
              onClick={() => router.push("/")}
            >
              กลับหน้าหลัก
            </Button>
            <Button
              className="btn-base white-outline-normal"
              onClick={() => router.push("/profiles/booking-history")}
            >
              ดูการจองทั้งหมด
            </Button>
          </div>
        </div>
      </div>
    </NavAndFooter>
  );
};

export default BookingSuccessPage;
