import React, {
  ReactElement,
  useEffect,
  useRef,
  useState,
  useCallback,
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
  const totalPriceInSatang = totalPrice * 100; // แปลงเป็นสตางค์

  // ฟังก์ชันสร้าง public_id ในรูปแบบ booking-xxxxxxxxxx (17 ตัวอักษร)
  const generatePublicId = (): string => {
    const randomStr = Math.random().toString(36).substr(2, 10); // สตริงสุ่ม 10 ตัวอักษร
    return `booking-${randomStr}`;
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
        router.push(`/booking/${id}`);
        toast.success("เข้าสู่ระบบสำเร็จ");
      } else {
        toast.error("เข้าสู่ระบบล้มเหลว");
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
    if (!session?.user?.id) return;
    try {
      const res = (await axios.get(`/api/coupons/collected`)) as CouponsData;
      setCoupons(res?.coupons || []);
    } catch (err) {
      if (!axios.isCancel(err)) console.error("Failed to fetch coupons:", err);
    }
  };

  useEffect(() => {
    fetchBookingData();
    fetchCouponData();
  }, [id, session?.user?.id]);

  const releaseSeatsAsync = async () => {
    if (
      isUnlocking.current ||
      selectedSeats.length === 0 ||
      paymentSuccessful.current
    )
      return;
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
    if (
      isUnlocking.current ||
      selectedSeats.length === 0 ||
      paymentSuccessful.current
    )
      return;
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
    if (isUnlocking.current || paymentSuccessful.current) return;
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

  const handlePaymentClick = () => {
    if (totalPriceInSatang < 2000) {
      toast.error("ยอดรวมต้องอย่างน้อย 20 บาท");
      return;
    }
    _setRenderModal(
      <div className="p-6 bg-gray-g63f flex flex-col items-center rounded-2xl gap-y-4">
        <div className="text-f-20 text-white">ยืนยันการจอง</div>
        <div className="text-fr-14 text-gray-gedd">
          ยืนยันการจองและการชำระเงิน?
        </div>
        <div className="flex gap-x-4">
          <Button
            className="btn-base white-outline-normal"
            onClick={_handleCloseModal}
            disabled={isProcessing}
          >
            ยกเลิก
          </Button>
          <Button
            className="btn-base blue-normal cursor-pointer"
            onClick={handleConfirmPayment}
            disabled={isProcessing}
          >
            {isProcessing ? "กำลังดำเนินการ..." : "ยืนยัน"}
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

  const createPayment = async (bookingId: string) => {
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
        throw new Error(data.error || "การสร้างการชำระเงินล้มเหลว");
      return data.paymentId;
    } catch (err) {
      console.error("❌ Failed to create payment:", err);
      throw err;
    }
  };

  const createBooking = async () => {
    if (!bookingInfo?.id || selectedSeats.length === 0 || !session?.user?.id) {
      throw new Error("ข้อมูลการจองหรือผู้ใช้ไม่ถูกต้อง");
    }
    try {
      // คำนวณราคารวมหลังหักส่วนลดจากคูปอง
      let finalPrice = totalPriceInSatang;
      if (selectedCoupon) {
        if (selectedCoupon.discount_type === "FIXED") {
          finalPrice -= (selectedCoupon.discount_value || 0) * 100; // แปลงส่วนลดเป็นสตางค์
        } else if (selectedCoupon.discount_type === "PERCENTAGE") {
          const discount = Math.min(
            (finalPrice * (selectedCoupon.discount_value || 0)) / 100,
            (selectedCoupon.max_discount || Infinity) * 100
          );
          finalPrice -= discount;
        }
      }
      if (finalPrice < 0) finalPrice = 0;

      // สร้าง public_id ในรูปแบบ booking-xxxxxxxxxx (17 ตัวอักษร)
      const publicId = generatePublicId();

      console.log("Sending payload to /api/bookings/create:", {
        showtime_id: bookingInfo.id,
        user_id: session.user.id,
        seats: selectedSeats.map((seat) => ({
          showtime_seat_id: seat.id,
          price: (seat.price || 0) * 100,
        })),
        total_price: finalPrice / 100, // แปลงเป็น Float (บาท)
        coupon_id: selectedCoupon?.id || null,
        public_id: publicId,
        status: "PENDING",
      });

      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showtime_id: bookingInfo.id,
          user_id: session.user.id,
          seats: selectedSeats.map((seat) => ({
            showtime_seat_id: seat.id,
            price: (seat.price || 0) * 100, // Float ในหน่วยสตางค์
          })),
          total_price: finalPrice / 100, // Float ในหน่วยบาท
          coupon_id: selectedCoupon?.id || null,
          public_id: publicId,
          status: "PENDING",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("❌ Booking creation failed:", data);
        throw new Error(data.error || "การสร้างการจองล้มเหลว");
      }
      return { bookingId: data.bookingId, publicId: data.public_id };
    } catch (err) {
      console.error("❌ Failed to create booking:", err);
      throw err;
    }
  };

  const handlePayment = async () => {
    if (!bookingInfo?.id || selectedSeats.length === 0 || !session?.user?.id) {
      toast.error("ข้อมูลการจองหรือผู้ใช้ไม่ถูกต้อง");
      return;
    }
    setIsProcessing(true);
    try {
      // สร้างการจองก่อน
      const { bookingId, publicId } = await createBooking();

      // สร้างการชำระเงิน
      const paymentId = await createPayment(bookingId);

      // อัปเดตสถานะการจองเป็น PAID
      await fetch(`/api/bookings/update-status/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });

      // อัปเดตสถานะที่นั่งเป็น BOOKED โดยคง locked_by_user_id
      await Promise.all(
        selectedSeats.map((seat) =>
          fetch(`/api/seats/update-status/${seat.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "BOOKED" }), // คง locked_by_user_id
          })
        )
      );

      // อัปเดตสถานะคูปองถ้ามีการใช้
      if (selectedCoupon) {
        await fetch(`/api/coupons/use/${selectedCoupon.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: session.user.id }),
        });
      }

      // ตั้งค่าสถานะการชำระเงินสำเร็จ
      paymentSuccessful.current = true;
      toast.success("ชำระเงินและจองสำเร็จ!");
      setBookingInfo((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          seats: prev.seats.map((row) => ({
            ...row,
            seats: row.seats.map((seat) =>
              selectedSeats.some((s) => s.id === seat.id)
                ? { ...seat, status: "BOOKED" }
                : seat
            ),
          })),
        };
      });
      setSelectedSeats([]);
      router.push(`/booking/${publicId}/success`);
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "ชำระเงินหรือจองไม่สำเร็จ"
      );
      // ไม่เรียก releaseSeatsAsync ที่นี่ เพราะจัดการใน useEffect
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setCanPay(false);
    handlePayment();
  };

  const onCountdown = useCallback(() => {
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
  }, []);

  const handlePaymentMethodChange = useCallback(
    (method: "credit_card" | "qr_code") => {
      setPaymentMethod(method);
      console.log("Payment method changed in BookingSeat:", method); // Debug
    },
    []
  );

  useEffect(() => {
    if (step === "2") {
      onCountdown();
    }
  }, [step, onCountdown]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        selectedSeats.length > 0 &&
        step === "2" &&
        !paymentSuccessful.current
      ) {
        e.preventDefault();
        releaseSeatsSync();
      }
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

  const memoizedCountdown = useMemo(() => formatTime(countdown), [countdown]);

  return (
    <NavAndFooter>
      <div className="w-dvw flex flex-col justify-center items-center p-4 bg-gray-gc1b">
        <Stepper step={step} onClickStep={() => setStep("1")} />
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
            amount={totalPrice} // ส่งในหน่วยบาท (UI)
            metadata={{
              order_id: "ORD-" + Date.now(),
              customer_id: session?.user?.id || "guest",
              product: "Premium Package",
            }}
            onSuccess={handlePaymentSuccess}
            onValidChange={setCanPay}
            onPaymentMethodChange={handlePaymentMethodChange}
            countdown={memoizedCountdown}
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
