import SummaryBoxCard from "@/components/Cards/SummaryBoxCard";
import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import SeatWidget from "@/components/Widgets/seatWidget";
import { Stepper } from "@/components/Widgets/Stepper";
import { userService } from "@/config/userServices";
import { BookingInfo } from "@/types/cinema";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const BookingSeat = () => {
  const [step, setStep] = useState("1");

  const router = useRouter();
  const { id } = router.query;

  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const fetchBookingInfo = async () => {
      const res = await userService.GET_SHOWTIME_BOOKING(id);
      console.log("res booking", res);
      setBookingInfo(res);
    };

    fetchBookingInfo();
  }, [id]);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  return (
    <NavAndFooter>
      <div className="w-full flex flex-col justify-center items-center p-4 bg-gray-gc1b">
        <Stepper step={step} />
      </div>
      <div className="flex justify-center p-20 gap-x-24 flex-wrap">
        <SeatWidget data={bookingInfo} />
        <SummaryBoxCard data={bookingInfo} />
      </div>
    </NavAndFooter>
  );
};

export default BookingSeat;
