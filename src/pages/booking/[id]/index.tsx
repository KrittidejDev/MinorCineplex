import React, { ReactElement, useEffect, useRef, useState } from "react";
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
import ModalEmpty from "@/components/Modals/ModalEmpty";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

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
  const [canPay, setCanPay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "credit_card" | "qr_code" | undefined
  >(undefined);
  const [_isShowModal, _setIsShowmodal] = useState<boolean>(false);
  const [_renderModal, _setRenderModal] = useState<ReactElement | null>();
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentRef = useRef<PaymentFormHandles>(null);
  const countdownActive = useRef(false);
  const channelRef = useRef<any>(null);
  const isUnlocking = useRef(false);
  const isNavigating = useRef(false);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const paymentSuccessful = useRef(false);

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + (seat.price || 0),
    0
  );

  const handlePaymentClick = () => {
    _setRenderModal(
      <div className="p-6 bg-gray-g63f flex flex-col items-center rounded-2xl gap-y-4">
        <div className="text-f-20 text-white">Confirm booking</div>
        <div className="text-fr-14 text-gray-gedd">
          Confirm booking and payment?
        </div>
        <div className="flex gap-x-4">
          <Button
            className="btn-base white-outline-normal"
            onClick={_handleCloseModal}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            className="btn-base blue-normal"
            onClick={handleConfirmPayment}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </div>
    );
    _setIsShowmodal(true);
  };

  const handleConfirmPayment = (): void => {
    paymentRef.current?.submitPayment();
  };

  const _handleCloseModal = () => {
    if (!isProcessing) {
      _setRenderModal(null);
      _setIsShowmodal(false);
    }
  };

  console.log("Booking Info", bookingInfo);

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
                ? { ...seat, status, lockedBy, lockExpire }
                : seat
            ),
          })),
        };
      });
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
  }, [bookingInfo?.id]);

  // Countdown
  useEffect(() => {
    if (step !== "2" || countdownActive.current) return;
    countdownActive.current = true;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current!);
          countdownInterval.current = null;
          releaseSeats(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    countdownInterval.current = interval;

    return () => {
      clearInterval(interval);
      countdownActive.current = false;
    };
  }, [step]);

  // Handle page close/refresh - unlock seats
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        selectedSeats.length > 0 &&
        step === "2" &&
        !paymentSuccessful.current
      ) {
        releaseSeatsSync();
      }
    };

    const handleRouteChange = (url: string) => {
      // Don't unlock if payment was successful
      if (paymentSuccessful.current) {
        return;
      }

      // Don't unlock if navigating away from page without locked seats
      if (selectedSeats.length === 0 || step !== "2") {
        return;
      }

      // If we're already unlocking, don't do it again
      if (isUnlocking.current || isNavigating.current) {
        return;
      }

      isNavigating.current = true;
      router.events.emit("routeChangeError");

      releaseSeatsAsync()
        .then(() => {
          setSelectedSeats([]);
          setStep("1");
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
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChange);

      // Cleanup when component unmounts
      if (
        selectedSeats.length > 0 &&
        step === "2" &&
        !paymentSuccessful.current &&
        !isUnlocking.current
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
      setStep("2");
      setCountdown(5 * 60);
    } catch (err) {
      console.error(err);
      toast.error("ล็อกเก้าอี้ไม่สำเร็จ");
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
        console.log("✅ Seats unlocked successfully");
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
        // Fallback to synchronous XHR
        try {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/seats/unlock-batch", false);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(payload);
          console.log("✅ Seats unlocked via XHR");
        } catch (xhrErr) {
          console.error("❌ XHR failed:", xhrErr);
        }
      } else {
        console.log("✅ Seats unlocked via Beacon");
      }
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

      setSelectedSeats([]);
      setStep("1");

      if (showAlert) {
        toast.error(
          "เวลาชำระเงินหมด เก้าอี้ถูกปลดล็อกแล้ว กรุณาเลือกเก้าอี้ใหม่"
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      isUnlocking.current = false;
    }
  };

  const handlePayment = async () => {
    console.log("confirm payment", selectedSeats);

    if (!bookingInfo?.id || selectedSeats.length === 0) {
      toast.error("Invalid booking information");
      return;
    }

    setIsProcessing(true);

    try {
      // Set flag to prevent unlock on navigation
      isUnlocking.current = true;

      // Call API to confirm payment and create booking
      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          showtimeId: bookingInfo.id,
          seats: selectedSeats.map((seat) => seat.id),
          totalPrice: totalPrice,
          couponId: selectedCoupon?.id || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        isUnlocking.current = false;
        setIsProcessing(false);
        throw new Error(data.error || "Payment failed");
      }

      // Mark payment as successful - prevent unlock on navigation
      paymentSuccessful.current = true;

      toast.success("ชำระเงินสำเร็จ!");

      // Update local state to show seats as booked
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
                    lockedBy: null,
                    lockExpire: null,
                  }
                : seat
            ),
          })),
        };
      });

      // Clear selected seats to prevent unlock on navigation
      setSelectedSeats([]);

      // Redirect to success page
      router.push(`/booking/${data.bookingId}/success`);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "ชำระเงินไม่สำเร็จ");
      isUnlocking.current = false;
      setIsProcessing(false);
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
        {step === "1" && (
          <SeatWidget
            data={bookingInfo}
            selectedSeats={selectedSeats}
            onSelectSeat={setSelectedSeats}
            userId={session?.user?.id}
          />
        )}
        {step === "2" && (
          <PaymentForm
            ref={paymentRef}
            amount={selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0)}
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
            totalPrice={selectedSeats.reduce(
              (sum, seat) => sum + (seat.price || 0),
              0
            )}
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
      <ModalEmpty isShowModal={_isShowModal} onClose={_handleCloseModal}>
        {_renderModal}
      </ModalEmpty>
    </NavAndFooter>
  );
};

export default BookingSeat;
