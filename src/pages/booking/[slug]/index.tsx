import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import SummaryBoxCard from "@/components/Cards/SummaryBoxCard";
import { Stepper } from "@/components/Widgets/Stepper";
import { userService } from "@/config/userServices";
import { BookingInfo, SelectedSeat } from "@/types/cinema";
import SeatWidget from "@/components/Widgets/seatWidget";
import { CouponCardData, CouponsData } from "@/types/coupon";
import PaymentForm, {
  PaymentFormHandles,
} from "@/components/Forms/PaymentForm";
import ModalEmpty from "@/components/Modals/ModalEmpty";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import ModalLogin from "@/components/Widgets/ModalLogin";

const BookingSeat: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const { data: session } = useSession();

  const [step, setStep] = useState<"1" | "2">("1");
  const [bookingInfo, setBookingInfo] = useState<BookingInfo>();
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [countdown, setCountdown] = useState<number>(5 * 60);
  const [coupons, setCoupons] = useState<CouponCardData[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponCardData | null>(
    null
  );
  const [canPay, setCanPay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "credit_card" | "qr_code" | undefined
  >(undefined);
  const [_isShowModal, _setIsShowmodal] = useState<boolean>(false);
  const [_renderModal, _setRenderModal] = useState<ReactElement | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const paymentRef = useRef<PaymentFormHandles | null>(null);
  const countdownActive = useRef(false);

  const isUnlocking = useRef(false);
  const isNavigating = useRef(false);
  const countdownInterval = useRef<number | null>(null);
  const paymentSuccessful = useRef(false);

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + (seat.price || 0),
    0
  );

  const handleLogin = async (value: { email: string; password: string }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: value.email,
        password: value.password,
      });
      if (result?.ok) {
        setShowLoginModal(false);
        router.push(`/booking/${id}`);
        toast.success("Login successful");
      } else {
        toast.error("Login failed");
        setShowLoginModal(false);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log("Login failed:", error);
      }
    }
  };

  const fetchBookingData = async () => {
    if (!id) return;
    const ac = new AbortController();
    try {
      const res = await axios.get(`/api/booking/showtimes/${id}`, {
        signal: ac.signal,
      });
      setBookingInfo(res.data as BookingInfo);
      setIsLoading(false);
    } catch (err) {
      if (!axios.isCancel(err))
        console.error("Failed to fetch booking info:", err);
      setIsLoading(false);
    }
    return () => {
      ac.abort();
    };
  };

  const fetchCouponData = async () => {
    if (session?.user?.id) return;
    try {
      const res = (await axios.get(`/api/coupons/collected`)) as CouponsData;
      setCoupons(res?.coupons || []);
    } catch (err) {
      if (!axios.isCancel(err))
        console.error("Failed to fetch booking info:", err);
    }
  };

  useEffect(() => {
    fetchBookingData();
    fetchCouponData();
  }, [id, session?.user?.id]);

  // ----------------- Seat release helpers -----------------
  const releaseSeatsAsync = async () => {
    if (isUnlocking.current || selectedSeats.length === 0) return;
    isUnlocking.current = true;
    try {
      await fetch("/api/seats/unlock-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seats: selectedSeats.map((seat) => seat.id) }),
      });
      setSelectedSeats([]);
      setStep("1");
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

  // ----------------- Lock seats -----------------
  const lockSeats = async () => {
    if (!session?.user) {
      setShowLoginModal(true);
      return;
    }
    if (!selectedSeats.length) return;
    const userId = session?.user?.id;
    try {
      await Promise.all(
        selectedSeats.map((seat) =>
          userService.POST_LOCK_SEAT(seat.id, userId || "guest")
        )
      );
      setStep("2");
      setCountdown(5 * 60);
    } catch (err) {
      console.error(err);
      toast.error("ล็อกเก้าอี้ไม่สำเร็จ");
    }
  };

  // ----------------- Payment handlers -----------------
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
            className="btn-base blue-normal cursor-pointer"
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

  const handleConfirmPayment = (): void => paymentRef.current?.submitPayment();

  const _handleCloseModal = () => {
    if (!isProcessing) {
      _setRenderModal(null);
      _setIsShowmodal(false);
    }
  };
  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)
      .toString()
      .padStart(2, "0")}:${(sec % 60).toString().padStart(2, "0")}`;

  const handlePayment = async () => {
    if (!bookingInfo?.id || selectedSeats.length === 0)
      return toast.error("Invalid booking information");
    setIsProcessing(true);
    try {
      isUnlocking.current = true;
      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showtimeId: bookingInfo.id,
          seats: selectedSeats.map((seat) => seat.id),
          totalPrice: totalPrice,
          couponId: selectedCoupon?.id || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Payment failed");
      paymentSuccessful.current = true;
      toast.success("ชำระเงินสำเร็จ!");
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
      setSelectedSeats([]);
      router.push(`/booking/${data.bookingId}/success`);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "ชำระเงินไม่สำเร็จ");
    } finally {
      isUnlocking.current = false;
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setCanPay(false);
    handlePayment();
  };

  const onCountdown = () => {
    countdownActive.current = true;
    countdownInterval.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownInterval.current)
            clearInterval(countdownInterval.current);
          releaseSeats(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
      countdownActive.current = false;
    };
  };

  useEffect(() => {
    if (step === "2") {
      onCountdown();
    }
  }, [step]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        selectedSeats.length > 0 &&
        step === "2" &&
        !paymentSuccessful.current
      )
        releaseSeatsSync();
    };

    const handleRouteChange = (url: string) => {
      if (paymentSuccessful.current) return;
      if (selectedSeats.length === 0 || step !== "2") return;
      if (isUnlocking.current || isNavigating.current) return;

      isNavigating.current = true;
      releaseSeatsAsync().finally(() => {
        isNavigating.current = false;
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChange);

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

  console.log("payment change", paymentMethod);

  // ----------------- JSX -----------------
  return (
    <NavAndFooter>
      <div className="w-dvw flex flex-col justify-center items-center p-4 bg-gray-gc1b">
        <Stepper step={step} />
      </div>
      <div className="w-full flex flex-1 justify-center py-10 md:p-20 md:gap-x-24 flex-wrap gap-y-5">
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
        <div className="flex flex-1 lg:max-w-[305px]">
          {!isLoading && bookingInfo && (
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
          )}
        </div>
      </div>
      <ModalEmpty isShowModal={_isShowModal} onClose={_handleCloseModal}>
        {_renderModal}
      </ModalEmpty>

      <ModalLogin
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        onLogin={handleLogin}
      />
    </NavAndFooter>
  );
};

export default BookingSeat;
