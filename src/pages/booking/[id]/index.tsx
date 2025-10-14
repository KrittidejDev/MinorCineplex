import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import SummaryBoxCard from "@/components/Cards/SummaryBoxCard";
import { Stepper } from "@/components/Widgets/Stepper";
import { userService } from "@/config/userServices";
import { BookingInfo, SelectedSeat } from "@/types/cinema";
import { ablyClient } from "@/lib/ably";
import SeatWidget from "@/components/Widgets/seatWidget";
import { CouponCardData, CouponsData } from "@/types/coupon";
import PaymentForm, {
  PaymentFormHandles,
} from "@/components/Forms/PaymentForm";

const BookingSeat = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  const [step, setStep] = useState("2");
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [countdown, setCountdown] = useState(5 * 60);
  const [coupons, setCoupons] = useState<CouponCardData[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponCardData | null>(
    null
  );
  const [canPay, setCanPay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "credit_card" | "qr_code" | undefined
  >(undefined);

  const paymentRef = useRef<PaymentFormHandles>(null);
  const countdownActive = useRef(false);
  const channelRef = useRef<any>(null);
  const isUnlocking = useRef(false);
  const isNavigating = useRef(false);

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + (seat.price || 0),
    0
  );

  const handlePaymentClick = () => {
    paymentRef.current?.submitPayment();
  };

  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    const fetchBookingInfo = async () => {
      try {
        const res = await userService.GET_SHOWTIME_BOOKING(id);
        setBookingInfo(res as BookingInfo);

        const couponRes =
          (await userService.GET_COUPON_COLLECTED()) as CouponsData;
        setCoupons(couponRes?.coupons || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookingInfo();
  }, [id]);

  // Ably real-time update
  useEffect(() => {
    if (!bookingInfo?.id) return;
    if (channelRef.current) return;

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
                ? {
                    ...seat,
                    status,
                    locked_by: lockedBy,
                    locked_at: msg.data.locked_at,
                    lockExpire,
                  }
                : seat
            ),
          })),
        };
      });

      // Update countdown if this is our locked seat
      if (
        status === "LOCKED" &&
        lockedBy === session?.user?.id &&
        msg.data.locked_at
      ) {
        const lockedTime = new Date(msg.data.locked_at).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - lockedTime) / 1000);
        const remaining = Math.max(0, 5 * 60 - elapsed);
        setCountdown(remaining);
      }
    };

    channel.subscribe("update", handleUpdate);
    channelRef.current = { channel, handleUpdate };

    return () => {
      if (channelRef.current) {
        channelRef.current.channel.unsubscribe(
          "update",
          channelRef.current.handleUpdate
        );
        channelRef.current = null;
      }
    };
  }, [bookingInfo?.id, session?.user?.id]);

  // Countdown
  useEffect(() => {
    if (step !== "3" || countdownActive.current) return;

    countdownActive.current = true;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          releaseSeats(true);
          countdownActive.current = false;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      countdownActive.current = false;
    };
  }, [step]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (selectedSeats.length > 0 && step === "3" && !isUnlocking.current) {
        releaseSeatsSync();
      }
    };

    const handleRouteChange = (url: string) => {
      if (
        selectedSeats.length > 0 &&
        step === "3" &&
        !isUnlocking.current &&
        !isNavigating.current
      ) {
        isNavigating.current = true;
        router.events.emit("routeChangeError");
        releaseSeatsAsync()
          .then(() => {
            setSelectedSeats([]);
            setStep("2");
            isNavigating.current = false;
            setTimeout(() => {
              router.push(url);
            }, 100);
          })
          .catch((err) => {
            console.error("❌ Failed to release seats:", err);
            isNavigating.current = false;
            router.push(url);
          });

        throw "Route change aborted to unlock seats";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChange);
      if (
        selectedSeats.length > 0 &&
        step === "3" &&
        !isUnlocking.current &&
        !isNavigating.current
      ) {
        releaseSeatsSync();
      }
    };
  }, [selectedSeats, step, router]);

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

      // Refetch booking info to get updated locked_at
      const res = await userService.GET_SHOWTIME_BOOKING(id as string);
      setBookingInfo(res as BookingInfo);

      // Calculate countdown from locked_at time
      const updatedSeats = (res as BookingInfo).seats.flatMap(
        (row) => row.seats
      );
      const lockedSeat = updatedSeats.find((s) => s.id === selectedSeats[0].id);

      if (lockedSeat?.locked_at) {
        const lockedTime = new Date(lockedSeat.locked_at).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - lockedTime) / 1000);
        const remaining = Math.max(0, 5 * 60 - elapsed);
        setCountdown(remaining);
      } else {
        setCountdown(5 * 60);
      }

      setStep("3");
    } catch (err) {
      console.error(err);
      alert("ล็อกเก้าอี้ไม่สำเร็จ");
    }
  };

  const releaseSeatsAsync = async () => {
    if (isUnlocking.current || selectedSeats.length === 0) {
      return;
    }
    isUnlocking.current = true;
    try {
      const response = await fetch("/api/seats/unlock-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seats: selectedSeats.map((seat) => seat.id),
        }),
      });
      if (response.ok) {
        updateSeatsToAvailable();
      } else {
        console.error("❌ API returned error:", await response.text());
      }
    } catch (err) {
      console.error("❌ Failed to unlock seats:", err);
    } finally {
      isUnlocking.current = false;
    }
  };

  const releaseSeatsSync = () => {
    if (isUnlocking.current || selectedSeats.length === 0) return;
    isUnlocking.current = true;
    const seatIds = selectedSeats.map((seat) => seat.id);
    try {
      const payload = JSON.stringify({ seats: seatIds });
      const beaconUrl = `${window.location.origin}/api/seats/unlock-batch`;
      const beaconSent = navigator.sendBeacon(
        beaconUrl,
        new Blob([payload], { type: "application/json" })
      );
      if (!beaconSent) {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/seats/unlock-batch", false);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(payload);
        } catch (xhrErr) {
          console.error("❌ XHR failed:", xhrErr);
        }
      }
      updateSeatsToAvailable();
    } catch (err) {
      console.error("❌ Failed to unlock seats:", err);
    } finally {
      isUnlocking.current = false;
    }
  };

  const releaseSeats = async (showAlert = false) => {
    if (isUnlocking.current) return;
    isUnlocking.current = true;

    try {
      await Promise.all(
        selectedSeats.map((seat) => userService.PATCH_UNLOCK_SEAT(seat.id))
      );

      updateSeatsToAvailable();
      setSelectedSeats([]);
      setStep("2");

      if (showAlert) {
        alert("เวลาชำระเงินหมด เก้าอี้ถูกปลดล็อกแล้ว");
      }
    } catch (err) {
      console.error(err);
    } finally {
      isUnlocking.current = false;
    }
  };

  const updateSeatsToAvailable = () => {
    const seatsToUpdate = [...selectedSeats];
    setBookingInfo((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        seats: prev.seats.map((row) => ({
          ...row,
          seats: row.seats.map((seat) =>
            seatsToUpdate.some((s) => s.id === seat.id)
              ? {
                  ...seat,
                  status: "AVAILABLE",
                  locked_by: null,
                  locked_at: null,
                  lockExpire: null,
                }
              : seat
          ),
        })),
      };
    });
  };

  const handlePayment = async () => {
    if (!selectedSeats.length) return;

    const invalidSeats = selectedSeats.filter(
      (seat) =>
        bookingInfo?.seats
          .flatMap((row) => row.seats)
          .find((s) => s.id === seat.id)?.locked_by !== session?.user?.id
    );

    if (invalidSeats.length > 0) {
      alert("Some seats are locked by another user or expired.");
      return;
    }

    try {
      isUnlocking.current = true;

      await userService.POST_PAYMENT({
        userId: session?.user?.id || "guest",
        seats: selectedSeats.map((s) => s.id),
        couponId: selectedCoupon?.id,
      });

      alert("ชำระเงินสำเร็จ!");

      setBookingInfo((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          seats: prev.seats.map((row) => ({
            ...row,
            seats: row.seats.map((seat) =>
              selectedSeats.some((s) => s.id === seat.id)
                ? {
                    ...seat,
                    status: "BOOKED",
                    locked_by: null,
                    locked_at: null,
                    lockExpire: null,
                  }
                : seat
            ),
          })),
        };
      });

      setSelectedSeats([]);
      isUnlocking.current = false;
    } catch (err) {
      console.error(err);
      alert("ชำระเงินไม่สำเร็จ");
      isUnlocking.current = false;
    }
  };

  const handlePaymentSuccess = () => {
    setCanPay(false);
    handlePayment();
  };

  return (
    <NavAndFooter>
      <div className="w-full flex flex-col justify-center items-center p-4 bg-gray-gc1b">
        <Stepper step={step} />
      </div>
      <div className="flex justify-center p-20 gap-x-24 flex-wrap">
        {step === "2" && (
          <SeatWidget
            data={bookingInfo}
            selectedSeats={selectedSeats}
            onSelectSeat={setSelectedSeats}
          />
        )}
        {step === "3" && (
          <PaymentForm
            ref={paymentRef}
            amount={totalPrice}
            metadata={{
              order_id: "ORD-" + Date.now(),
              customer_id: session?.user?.id || "guest",
              product: "Premium Package",
            }}
            onSuccess={handlePaymentSuccess}
            onValidChange={setCanPay}
            onPaymentMethodChange={setPaymentMethod}
            countdown={formatTime(countdown)}
          />
        )}
        <div className="flex flex-col gap-6">
          <SummaryBoxCard
            step={step}
            data={bookingInfo}
            lockSeats={lockSeats}
            totalSelected={selectedSeats}
            totalPrice={totalPrice}
            countdown={formatTime(countdown)}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            onSelectCoupon={setSelectedCoupon}
            onPayment={handlePaymentClick}
            canPay={canPay}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </NavAndFooter>
  );
};

export default BookingSeat;
