import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Tag from "../Widgets/Tag";
import PinFill from "../Icons/PinFill";
import DateRangeFill from "../Icons/DateRangeFill";
import TimeFill from "../Icons/TimeFill";
import Shop from "../Icons/Shop";
import BookingInfo from "./BookingInfo";
import { Button } from "../ui/button";
import { BillInfo, SelectedSeat } from "@/types/cinema";
import { CouponCardData } from "@/types/coupon";

interface Props extends BillInfo {
  countdown?: string;
  coupons?: CouponCardData[];
  selectedCoupon?: CouponCardData | null;
  onSelectCoupon?: (coupon: CouponCardData) => void;
  onPayment?: () => void;
  canPay: boolean;
  paymentMethod?: "credit_card" | "qr_code";
}

export default function SummaryBoxCard({
  data,
  canPay,
  totalSelected = [],
  totalPrice = 0,
  lockSeats,
  step,
  countdown,
  coupons = [],
  selectedCoupon,
  onSelectCoupon,
  onPayment,
  paymentMethod = "credit_card",
}: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const [isCouponModalOpen, setCouponModalOpen] = useState(false);

  return (
    <div className="w-full max-w-full lg:max-w-[305px] h-fit bg-gray-gc1b rounded-lg">
      <div className="p-4">
        {step === "3" && countdown && (
          <p className="text-sm text-gray-g3b0 pb-3">
            {lang === "en" ? "Time remaining:" : "เวลาที่เหลือ:"}{" "}
            <span className="text-sm text-blue-bbee pl-2">{countdown}</span>
          </p>
        )}
        <div className="flex gap-4 items-center">
          <Image
            src={data?.movie?.poster_url || "/default-poster.jpg"}
            alt={
              data?.movie?.title ||
              (lang === "en" ? "Movie Poster" : "โปสเตอร์หนัง")
            }
            width={82}
            height={120}
            className="object-cover rounded-md"
          />
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-xl text-white-wfff line-clamp-2">
              {data?.movie?.title}
            </h4>
            <div className="hidden sm:flex flex-wrap gap-2">
              {data?.movie?.genre?.split(",").map((e, i) => (
                <Tag key={i} name={e} variant="genre" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <div className="flex items-center gap-4">
            <PinFill width={16} height={16} color={"#565F7E"} />
            <p className="text-gray-gedd">{data?.hall?.cinema?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <DateRangeFill width={16} height={16} color={"#565F7E"} />
            <p className="text-gray-gedd">
              {data?.date &&
                new Date(data.date).toLocaleDateString(
                  lang === "en" ? "en-US" : "th-TH",
                  { day: "numeric", month: "long", year: "numeric" }
                )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <TimeFill width={16} height={16} color={"#565F7E"} />
            <p className="text-gray-gedd">{data?.time_slot?.start_time}</p>
          </div>
          <div className="flex items-center gap-4">
            <Shop width={16} height={16} color={"#565F7E"} />
            <p className="text-gray-gedd">{data?.hall?.name}</p>
          </div>
        </div>
      </div>
      {step === "2" && totalSelected.length > 0 && (
        <BookingInfo
          totalSelected={totalSelected}
          totalPrice={totalPrice}
          lockSeats={lockSeats}
        />
      )}
      {step === "3" && (
        <div className="p-4 flex flex-col gap-4">
          {coupons.length > 0 && (
            <div className="flex justify-between items-center text-gray-gedd">
              <span>{lang === "en" ? "Coupon" : "คูปอง"}</span>
              <Button
                onClick={() => setCouponModalOpen(true)}
                className="p-2 rounded bg-gray-g3b0 text-white text-sm"
              >
                {selectedCoupon
                  ? `${selectedCoupon.code} - ${selectedCoupon.discount_value}%`
                  : lang === "en"
                    ? "Select Coupon"
                    : "เลือกคูปอง"}
              </Button>
            </div>
          )}
          <div className="flex justify-between text-gray-gedd">
            <span>{lang === "en" ? "Selected Seat" : "ที่นั่งที่เลือก"}</span>
            <span>{totalSelected.map((s) => s.seat_number).join(", ")}</span>
          </div>
          <div className="flex justify-between text-white-wfff font-bold text-lg">
            <span>{lang === "en" ? "Discount" : "ส่วนลด"}</span>
            <span>-{selectedCoupon?.discount_value || 0}%</span>
          </div>
          <div className="flex justify-between text-gray-gedd">
            <span>{lang === "en" ? "Payment Method" : "วิธีชำระเงิน"}</span>
            <span className="capitalize text-white">
              {paymentMethod === "credit_card"
                ? lang === "en"
                  ? "Credit Card"
                  : "บัตรเครดิต"
                : lang === "en"
                  ? "QR Code"
                  : "คิวอาร์โค้ด"}
            </span>
          </div>
          <div className="flex justify-between text-white-wfff font-bold text-lg">
            <span>{lang === "en" ? "Total" : "รวมทั้งหมด"}</span>
            <span>
              {new Intl.NumberFormat(lang === "en" ? "en-US" : "th-TH", {
                style: "currency",
                currency: "THB",
              }).format(
                totalPrice *
                  (selectedCoupon ? 1 - selectedCoupon.discount_value / 100 : 1)
              )}
            </span>
          </div>
          <Button
            className="btn-base blue-normal"
            onClick={onPayment}
            disabled={!canPay}
          >
            {lang === "en" ? "Next" : "ถัดไป"}
          </Button>
        </div>
      )}
      {isCouponModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-gc1b rounded-lg p-4 w-80 max-w-full shadow-lg">
            <h4 className="text-white-wfff font-bold mb-4 text-center">
              {lang === "en" ? "Select Coupon" : "เลือกคูปอง"}
            </h4>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {coupons.map((c) => (
                <button
                  key={c.id}
                  className={`p-2 rounded text-left transition ${
                    selectedCoupon?.id === c.id
                      ? "bg-blue-bbee text-white-wfff"
                      : "bg-gray-g3b0 text-gray-gedd hover:bg-gray-g63f"
                  }`}
                  onClick={() => {
                    onSelectCoupon && onSelectCoupon(c);
                    setCouponModalOpen(false);
                  }}
                >
                  {c.code} - {c.discount_value}%
                </button>
              ))}
            </div>
            <Button
              onClick={() => setCouponModalOpen(false)}
              className="mt-4 w-full bg-gray-g3b0 hover:bg-gray-g63f text-white"
            >
              {lang === "en" ? "Close" : "ปิด"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
