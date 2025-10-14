import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import SummaryBoxCard from "@/components/Cards/SummaryBoxCard";
import { Stepper } from "@/components/Widgets/Stepper";
import { userService } from "@/config/userServices";
import { BookingInfo, SelectedSeat } from "@/types/cinema";
import { ablyClient } from "@/lib/ably";
import SeatWidget from "@/components/Widgets/seatWidget";
import { CouponCardData } from "@/types/coupon";

const BookingSeat = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  const [step, setStep] = useState("1");
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [countdown, setCountdown] = useState(5 * 60);
  const [coupons, setCoupons] = useState<CouponCardData[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponCardData | null>(
    null
  );

  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    const fetchBookingInfo = async () => {
      try {
        const res = await userService.GET_SHOWTIME_BOOKING(id);
        setBookingInfo(res as BookingInfo);

        // ดึงคูปองของ user
        // const couponRes = await userService.GET_MY_COUPONS(
        //   session?.user?.id || "guest"
        // );
        // setCoupons(couponRes || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookingInfo();
  }, [id, session?.user?.id]);

  useEffect(() => {
    if (!bookingInfo?.id) return;
    const channel = ablyClient.channels.get(`showtime:${bookingInfo.id}`);
    const handleUpdate = (msg: any) => {
      const { seatId, status, lockedBy, lockExpire } = msg.data;
      setBookingInfo((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          seats: prev.seats.map((row) => ({
            ...row,
            seats: row.seats.map((seat) =>
              seat.id === seatId
                ? { ...seat, status, lockedBy, lockExpire }
                : seat
            ),
          })),
        };
      });
    };
    channel.subscribe("update", handleUpdate);
    return () => channel.unsubscribe("update", handleUpdate);
  }, [bookingInfo?.id]);

  useEffect(() => {
    if (step !== "2") return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          releaseSeats();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const lockSeats = async () => {
    if (!selectedSeats.length) return;
    try {
      await Promise.all(
        selectedSeats.map((seat) =>
          userService.POST_LOCK_SEAT(seat.id, session?.user?.id || "guest")
        )
      );
      setStep("2");
      setCountdown(5 * 60);
    } catch (err) {
      console.error(err);
      alert("ล็อกเก้าอี้ไม่สำเร็จ");
    }
  };

  const releaseSeats = async () => {
    try {
      await Promise.all(
        selectedSeats.map((seat) => userService.PATCH_UNLOCK_SEAT(seat.id))
      );
      setSelectedSeats([]);
      setStep("1");
      alert("เวลาชำระเงินหมด เก้าอี้ถูกปลดล็อกแล้ว");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = async () => {
    if (!selectedSeats.length) return;
    try {
      // await userService.POST_PAYMENT({
      //   userId: session?.user?.id || "guest",
      //   seats: selectedSeats.map((s) => s.id),
      //   couponId: selectedCoupon?.id,
      // });

      alert("ชำระเงินสำเร็จ!");
      setStep("3");
    } catch (err) {
      console.error(err);
      alert("ชำระเงินไม่สำเร็จ");
    }
  };

  return (
    <NavAndFooter>
      <div className="w-full flex flex-col justify-center items-center p-4 bg-gray-gc1b">
        <Stepper step={step} />
      </div>
      <div className="flex justify-center p-20 gap-x-24 flex-wrap">
        <SeatWidget
          data={bookingInfo}
          selectedSeats={selectedSeats}
          onSelectSeat={setSelectedSeats}
        />
        <div className="flex flex-col gap-6">
          <SummaryBoxCard
            step={step}
            data={bookingInfo}
            lockSeats={lockSeats}
            totalSelected={selectedSeats}
            totalPrice={selectedSeats.reduce(
              (sum, seat) => sum + (seat.price || 0),
              0
            )}
            countdown={formatTime(countdown)}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            onSelectCoupon={setSelectedCoupon}
            onPayment={handlePayment}
          />
        </div>
      </div>
    </NavAndFooter>
  );
};

export default BookingSeat;
