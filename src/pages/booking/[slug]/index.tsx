//pages/booking/[slug]/index.tsx
import React, {
  ReactElement,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
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
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const BookingSeat: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const fid = searchParams?.get("fid");
  const { data: session } = useSession();

  const [step, setStep] = useState<"1" | "2">("1");
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
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
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [renderModal, setRenderModal] = useState<ReactElement | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paymentRef = useRef<PaymentFormHandles | null>(null);
  const countdownActive = useRef(false);
  const isUnlocking = useRef(false);
  const isNavigating = useRef(false);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const paymentSuccessful = useRef(false);
  const { t, i18n } = useTranslation("common");
  const lang = i18n?.language === "en";

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + (seat.price || 0),
    0
  );
  const totalPriceInSatang = totalPrice * 100;

  const generatePublicId = (): string => {
    return `booking-${Math.random().toString(36).slice(2, 12)}`;
  };

  const handleLogin = async (value: { email: string; password: string }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: value.email,
        password: value.password,
      });
      if (result?.ok) {
        setShowLoginModal(false);
        toast.success("เข้าสู่ระบบสำเร็จ");
      } else {
        toast.error("เข้าสู่ระบบล้มเหลว");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  const fetchBookingData = async () => {
    if (!id || typeof id !== "string") {
      console.error("Invalid showtime ID:", id);
      setError("รหัสการแสดงไม่ถูกต้อง");
      setIsLoading(false);
      return;
    }
    const ac = new AbortController();
    try {
      const res = await axios.get(`/api/booking/showtimes/${id}`, {
        signal: ac.signal,
      });
      if (!res.data) throw new Error("No data returned");
      setBookingInfo(res.data as BookingInfo);
      setError(null);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Fetch booking error:", err);
        const message =
          err instanceof AxiosError && err.response?.data?.error
            ? err.response.data.error
            : "ไม่สามารถโหลดข้อมูลการจองได้";
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
    return () => ac.abort();
  };

  const fetchCouponData = async () => {
    if (!session?.user?.id) return;
    const ac = new AbortController();
    try {
      const res = (await axios.get(`/api/coupons/collected`, {
        signal: ac.signal,
      })) as CouponsData;
      setCoupons(res?.data.coupons || []);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Fetch coupons error:", err);
        toast.error("ไม่สามารถโหลดคูปองได้");
      }
    }
    return () => ac.abort();
  };

  const releaseSeatsAsync = async (showAlert = false) => {
    if (
      isUnlocking.current ||
      !selectedSeats.length ||
      paymentSuccessful.current
    )
      return;

    isUnlocking.current = true;
    try {
      const seatIds = selectedSeats.map((seat) => seat.id);
      const body = JSON.stringify({ seats: seatIds });
      const url = "/api/seats/unlock-batch";

      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);

      if (!ok) {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
      }

      setSelectedSeats([]);
      setStep("1");
      if (showAlert) toast.error("เวลาการจองหมด กรุณาเลือกที่นั่งใหม่");
      console.log("✅ Seats unlocked successfully");
    } catch (err) {
      console.error("Unlock seats error:", err);
      toast.error("ไม่สามารถปลดล็อกที่นั่งได้");
    } finally {
      isUnlocking.current = false;
    }
  };

  const lockSeats = async () => {
    if (!session?.user) {
      setShowLoginModal(true);
      return;
    }
    if (!selectedSeats.length) {
      toast.error("กรุณาเลือกที่นั่ง");
      return;
    }
    try {
      const invalidSeats = selectedSeats.filter(
        (seat) => !seat.id || typeof seat.id !== "string"
      );
      if (invalidSeats.length) {
        throw new Error(
          `Invalid seat IDs: ${invalidSeats.map((s) => s.id).join(", ")}`
        );
      }
      await Promise.all(
        selectedSeats.map((seat) =>
          userService.POST_LOCK_SEAT(seat.id, session.user.id)
        )
      );
      setStep("2");
      setCountdown(5 * 60);
      console.log("Seats locked successfully");
    } catch (err) {
      console.error("Lock seats error:", err);
      toast.error("ล็อกที่นั่งไม่สำเร็จ");
      setSelectedSeats([]);
      setStep("1");
    }
  };

  const checkSeatLock = async (): Promise<boolean> => {
    if (!session?.user?.id || !selectedSeats.length) {
      toast.error("กรุณาเข้าสู่ระบบหรือเลือกที่นั่ง");
      setStep("1");
      return false;
    }
    try {
      const responses = await Promise.all(
        selectedSeats.map(async (seat) => {
          if (!seat.id || typeof seat.id !== "string") {
            throw new Error(`Invalid seat ID: ${seat.id}`);
          }
          const res = await axios.get(`/api/seats/status/${seat.id}`);
          return { seatId: seat.id, data: res.data };
        })
      );

      const now = new Date();
      const invalidSeats = responses.filter(
        (res) =>
          res.data.status !== "LOCKED" ||
          res.data.locked_by_user_id !== session.user.id ||
          (res.data.locked_until && new Date(res.data.locked_until) < now)
      );

      if (invalidSeats.length) {
        const seatIds = invalidSeats.map((res) => res.seatId).join(", ");
        toast.error(`ที่นั่ง ${seatIds} ไม่ว่างหรือหมดเวลาการล็อก`);
        await releaseSeatsAsync(true);
        setSelectedSeats([]);
        setStep("1");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Check seat lock error:", err);
      toast.error("ไม่สามารถตรวจสอบสถานะที่นั่งได้");
      return false;
    }
  };

  const createBooking = async () => {
    if (!bookingInfo?.id || !selectedSeats.length || !session?.user?.id) {
      throw new Error("Invalid booking data");
    }
    try {
      const publicId = generatePublicId();
      let finalPrice = totalPriceInSatang;
      if (selectedCoupon) {
        if (selectedCoupon.discount_type === "FIXED") {
          finalPrice -= (selectedCoupon.discount_value || 0) * 100;
        } else if (selectedCoupon.discount_type === "PERCENTAGE") {
          const discount = Math.min(
            (finalPrice * (selectedCoupon.discount_value || 0)) / 100,
            (selectedCoupon.max_discount || Infinity) * 100
          );
          finalPrice -= discount;
        } else if (selectedCoupon.discount_type === "BUY_X_GET_Y") {
          const buyQty = selectedCoupon.buy_quantity || 0;
          const getQty = selectedCoupon.get_quantity || 0;
          const totalSeats = selectedSeats.length;

          if (buyQty > 0 && getQty > 0 && totalSeats >= buyQty) {
            const freeSets = Math.floor(totalSeats / buyQty);
            const freeSeats = freeSets * getQty;

            const avgPrice =
              selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0) /
              totalSeats;

            const discount = freeSeats * avgPrice * 100;
            finalPrice -= discount;
          }
        }
      }

      if (finalPrice < 0) finalPrice = 0;

      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showtime_id: bookingInfo.id,
          user_id: session.user.id,
          seats: selectedSeats.map((seat) => ({
            showtime_seat_id: seat.id,
            price: (seat.price || 0) * 100,
          })),
          total_price: finalPrice / 100,
          coupon_id: selectedCoupon?.id || null,
          public_id: publicId,
          status: "PENDING",
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to create booking");
      return { bookingId: data.bookingId, publicId };
    } catch (err) {
      console.error("Create booking error:", err);
      throw err;
    }
  };

  const createPayment = async (bookingId: string) => {
    if (!bookingId || typeof bookingId !== "string")
      throw new Error("Invalid booking ID");
    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          userId: session?.user?.id || "guest",
          amount: totalPriceInSatang,
          paymentMethod: paymentMethod || "CREDIT_CARD",
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to create payment");
      return data.paymentId;
    } catch (err) {
      console.error("Create payment error:", err);
      throw err;
    }
  };

  const handlePayment = async () => {
    if (!bookingInfo?.id || !selectedSeats.length || !session?.user?.id) {
      toast.error("ข้อมูลการจองไม่ครบถ้วน");
      return;
    }
    setIsProcessing(true);
    try {
      const seatsValid = await checkSeatLock();
      if (!seatsValid) return;
      const { bookingId, publicId } = await createBooking();
      const paymentId = await createPayment(bookingId);
      const response = await fetch("/api/booking/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          seatIds: selectedSeats.map((seat) => seat.id),
          userId: session.user.id,
          couponId: selectedCoupon?.id || null,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to complete booking");
      paymentSuccessful.current = true;
      toast.success("ชำระเงินและจองสำเร็จ!");
      router.push(`/booking/success?pid=${publicId}`);
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("ชำระเงินหรือจองไม่สำเร็จ");
      await releaseSeatsAsync(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentClick = () => {
    if (totalPriceInSatang < 2000) {
      toast.error(t("price_must_be_at_least_20_baht"));
      return;
    }
    setRenderModal(
      <div className="p-6 bg-gray-g63f flex flex-col items-center rounded-2xl gap-y-4">
        <div className="text-f-20 text-white">{t("confirm_booking")}</div>
        <div className="text-fr-14 text-gray-gedd">
          {t("confirm_booking_and_payment_message")}
        </div>
        <div className="flex gap-x-4">
          <Button
            className="btn-base white-outline-normal"
            onClick={() => setIsShowModal(false)}
            disabled={isProcessing}
          >
            {t("cancel")}
          </Button>
          <Button
            className="btn-base blue-normal cursor-pointer"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? t("processing") : t("confirm")}
          </Button>
        </div>
      </div>
    );
    setIsShowModal(true);
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchBookingData(), fetchCouponData()]).finally(() =>
      setIsLoading(false)
    );
  }, [id, session?.user?.id, fid]);

  useEffect(() => {
    if (step === "2" && !countdownActive.current) {
      countdownActive.current = true;
      countdownInterval.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval.current!);
            if (!paymentSuccessful.current) releaseSeatsAsync(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
      countdownActive.current = false;
    };
  }, [step]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        selectedSeats.length > 0 &&
        step === "2" &&
        !paymentSuccessful.current
      ) {
        e.preventDefault();
        releaseSeatsAsync();
      }
    };

    const handleRouteChange = () => {
      if (
        paymentSuccessful.current ||
        selectedSeats.length === 0 ||
        step !== "2"
      )
        return;
      if (isUnlocking.current || isNavigating.current) return;
      isNavigating.current = true;
      releaseSeatsAsync().finally(() => (isNavigating.current = false));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [selectedSeats]);

  useEffect(() => {
    if (
      step === "1" &&
      selectedSeats.length > 0 &&
      !paymentSuccessful.current
    ) {
      releaseSeatsAsync(true);
    }
  }, [step]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" &&
        step === "2" &&
        selectedSeats.length > 0 &&
        !paymentSuccessful.current
      ) {
        releaseSeatsAsync();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedSeats, step]);

  const memoizedCountdown = useMemo(() => {
    const minutes = Math.floor(countdown / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (countdown % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [countdown]);

  return (
    <NavAndFooter
      seoProps={{
        title: `จองที่นั่ง - ${bookingInfo?.movie?.title} ${bookingInfo?.hall?.name} ${lang ? bookingInfo?.cinema?.translations?.en?.name : bookingInfo?.cinema?.translations?.th?.name}`,
        description: bookingInfo
          ? `จองที่นั่งสำหรับรอบ ${bookingInfo.time_slot?.name} ในฮอลล์ ${bookingInfo.hall?.name}`
          : "ระบบจองตั๋วหนัง Minorcineplex",
        image: bookingInfo?.movie?.poster_url || "/images/cover-cinema.png",
        imageWidth: 800,
        imageHeight: 1200,
        imageAlt: bookingInfo?.movie?.title
          ? `โปสเตอร์ภาพยนตร์ ${bookingInfo.movie.title}`
          : "Minorcineplex",
        url: `https://minor-cineplex-phi.vercel.app/booking/${bookingInfo?.movie?.title}-${bookingInfo?.hall?.name}-${lang ? bookingInfo?.cinema?.translations?.en?.name : bookingInfo?.cinema?.translations?.th?.name}?id=${bookingInfo?.id}`,
        type: "website",
        customMetaTags: [
          {
            name: "keywords",
            content: `จองตั๋วหนัง, Minorcineplex, ${
              bookingInfo?.movie?.title || ""
            }, ฮอลล์ ${bookingInfo?.hall?.name || ""}`,
          },
        ],
      }}
    >
      <div className="w-dvw flex flex-col justify-center items-center p-4 bg-gray-gc1b">
        <Stepper step={step} onClickStep={() => setStep("1")} />
      </div>
      <div className="w-full flex flex-1 justify-center py-10 md:p-20 md:gap-x-24 flex-wrap gap-y-5">
        {isLoading ? (
          <div className="text-white">กำลังโหลด...</div>
        ) : error ? (
          <div className="text-white">{error}</div>
        ) : (
          <>
            {step === "1" && bookingInfo && (
              <SeatWidget
                data={bookingInfo}
                fid={fid}
                hall={bookingInfo?.hall?.name}
                selectedSeats={selectedSeats}
                onSelectSeat={(seats) => {
                  const validSeats = seats.filter(
                    (seat) => seat.id && typeof seat.id === "string"
                  );
                  if (validSeats.length !== seats.length) {
                    toast.error("ที่นั่งบางส่วนมีรูปแบบไม่ถูกต้อง");
                    return;
                  }
                  setSelectedSeats(validSeats);
                }}
                userId={session?.user?.id}
              />
            )}
            {step === "2" && (
              <PaymentForm
                ref={paymentRef}
                amount={totalPrice}
                metadata={{
                  order_id: `ORD-${Date.now()}`,
                  customer_id: session?.user?.id || "guest",
                  product: "Movie Ticket",
                }}
                onSuccess={handlePayment}
                onValidChange={setCanPay}
                onPaymentMethodChange={setPaymentMethod}
                countdown={memoizedCountdown}
              />
            )}
            <div className="flex flex-1 lg:max-w-[305px] sm:pr-4">
              {bookingInfo && (
                <SummaryBoxCard
                  step={step}
                  data={bookingInfo}
                  lockSeats={lockSeats}
                  totalSelected={selectedSeats}
                  totalPrice={totalPrice}
                  countdown={memoizedCountdown}
                  coupons={coupons}
                  selectedCoupon={selectedCoupon}
                  onSelectCoupon={setSelectedCoupon}
                  onPayment={handlePaymentClick}
                  canPay={canPay}
                  paymentMethod={paymentMethod}
                />
              )}
            </div>
          </>
        )}
      </div>
      <ModalEmpty
        isShowModal={isShowModal}
        onClose={() => setIsShowModal(false)}
      >
        {renderModal}
      </ModalEmpty>
      <ModalLogin
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        onLogin={handleLogin}
      />
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

export default BookingSeat;
