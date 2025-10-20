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
import { BillInfo, SummaryData } from "@/types/cinema";
import { CouponCardData } from "@/types/coupon";
import { CloseRoundLight, ExpandRightLight } from "../Icons/Icons";

interface Props extends BillInfo {
  data: SummaryData;
  countdown?: string;
  coupons?: CouponCardData[];
  selectedCoupon?: CouponCardData | null;
  onSelectCoupon?: (coupon: CouponCardData | null) => void;
  onPayment?: () => void;
  canPay: boolean;
  paymentMethod?: "credit_card" | "qr_code";
  step?: "1" | "2";
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
  console.log(selectedCoupon);
  let totalPriceWithDiscount = 0;
  if (selectedCoupon?.discount_type === "AMOUNT") {
    totalPriceWithDiscount = totalPrice - selectedCoupon.discount_value;
  } else if (selectedCoupon?.discount_type === "PERCENTAGE") {
    totalPriceWithDiscount =
      totalPrice * (1 - selectedCoupon.discount_value / 100);
  }
  return (
    <div className="w-full min-w-[305px] h-fit bg-gray-gc1b rounded-lg">
      {/* Movie Info */}
      <div className="p-4">
        {step === "2" && countdown && (
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

        {/* Cinema Info */}
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

      {/* Step 1 Summary */}
      {step === "1" && totalSelected.length > 0 && (
        <BookingInfo
          totalSelected={totalSelected}
          totalPrice={totalPriceWithDiscount}
          lockSeats={lockSeats}
        />
      )}

      {/* Step 2: Payment + Coupon */}
      {step === "2" && (
        <div className="p-4 flex flex-col gap-4">
          {/* Coupon Button */}
          {coupons.length > 0 && (
            <div className="flex flex-col justify-start items-start text-gray-gedd gap-2">
              <div className="flex justify-between items-center w-full">
                <span>{lang === "en" ? "Coupon" : "คูปอง"}</span>
                <span
                  className="text-blue-bbee cursor-pointer"
                  onClick={() => setCouponModalOpen(true)}
                >
                  <ExpandRightLight width="16" height="16" color="#C8CEDD" />
                </span>
              </div>
              <div className="w-full">
                <Button
                  className="p-2 rounded bg-gray-g63f text-gray-g3b0 text-sm w-full"
                  onClick={() => setCouponModalOpen(true)}
                >
                  {selectedCoupon ? (
                    <span className="truncate">{selectedCoupon.title_en}</span>
                  ) : lang === "en" ? (
                    "Select Coupon"
                  ) : (
                    "เลือกคูปอง"
                  )}
                  {selectedCoupon && (
                    <span
                      className="text-blue-bbee cursor-pointer"
                      onClick={() => onSelectCoupon && onSelectCoupon(null)}
                    >
                      <CloseRoundLight width="16" height="16" color="#C8CEDD" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Selected Seat */}
          <div className="flex justify-between text-gray-gedd">
            <span>{lang === "en" ? "Selected Seat" : "ที่นั่งที่เลือก"}</span>
            <span>{totalSelected.map((s) => s.seat_number).join(", ")}</span>
          </div>

          {/* Discount */}
          <div className="flex justify-between text-white-wfff font-bold text-lg">
            <span>{lang === "en" ? "Discount" : "ส่วนลด"}</span>
            <span>
              -{selectedCoupon?.discount_value || 0}{" "}
              {selectedCoupon?.discount_type === "PERCENTAGE" ? "%" : "THB"}
            </span>
          </div>

          {/* Payment Method */}
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

          {/* Total */}
          <div className="flex justify-between text-white-wfff font-bold text-lg">
            <span>{lang === "en" ? "Total" : "รวมทั้งหมด"}</span>
            <span>{Math.max(totalPriceWithDiscount, 0)}</span>
          </div>

          {/* Payment Button */}
          <Button
            className="btn-base blue-normal cursor-pointer"
            onClick={onPayment}
            disabled={!canPay}
          >
            {lang === "en" ? "Next" : "ถัดไป"}
          </Button>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="relative bg-gray-g63f rounded-xl p-6 w-full max-w-[1200px] shadow-2xl">
            {/* ปุ่ม X */}
            <button
              onClick={() => setCouponModalOpen(false)}
              className="absolute top-3 right-3 text-gray-gedd hover:text-white transition cursor-pointer"
            >
              ✕
            </button>

            {/* หัวข้อ */}
            <h4 className="text-white-wfff font-bold mb-6 text-center text-lg">
              {lang === "en" ? "Select Coupon" : "เลือกคูปอง"}
            </h4>

            {/* รายการคูปอง */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
              {coupons.length > 0 ? (
                coupons.map((c) => {
                  const isSelected = selectedCoupon?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      className={`flex items-center border rounded-lg overflow-hidden transition-all duration-300 cursor-pointer
                  ${
                    isSelected
                      ? "border-gray-g3b0 bg-gray-g3b0"
                      : "border-gray-gc1b bg-gray-g63f/30 hover:bg-gray-g63f/60"
                  }`}
                      onClick={() => onSelectCoupon && onSelectCoupon(c)}
                    >
                      {/* รูป */}
                      <div className="w-24 sm:w-[174px] h-full flex-shrink-0 relative">
                        <Image
                          src={c.image || "/default-coupon.png"}
                          alt={c.title_en}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* ข้อมูลคูปอง */}
                      <div
                        className={`flex flex-col justify-between p-3 flex-1 transition-colors h-full
                        ${isSelected ? "bg-gray-g3b0" : "bg-gray-gc1b"}
                        sm:p-4 sm:text-sm
                        md:p-6 md:text-base
                        `}
                      >
                        <div>
                          <h5 className="text-white-wfff font-semibold text-sm sm:text-base line-clamp-2">
                            {lang === "en" ? c.title_en : c.title_th}
                          </h5>
                          <p className="text-gray-gedd text-xs mt-1 sm:text-sm line-clamp-1">
                            {lang === "en"
                              ? `Valid until ${c.end_date ? new Date(c.end_date).toLocaleDateString() : "N/A"}`
                              : `ใช้ได้ถึง ${c.end_date ? new Date(c.end_date).toLocaleDateString() : "N/A"}`}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <span className="text-blue-bbee font-bold text-sm sm:text-base">
                            -{c.discount_value}%{" "}
                            {lang === "en" ? "OFF" : "ส่วนลด"}
                          </span>
                          <button
                            className="text-blue-bbee text-[10px] sm:text-sm hover:underline flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`/coupons/${c.id}`, "_blank");
                            }}
                          >
                            {lang === "en" ? "View details" : "ดูรายละเอียด"} →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-gedd text-center py-6 col-span-full">
                  {lang === "en"
                    ? "No available coupons"
                    : "ไม่มีคูปองที่ใช้งานได้"}
                </p>
              )}
            </div>

            {/* ปุ่ม Apply */}
            <div className="flex justify-end mt-6">
              <Button
                disabled={!selectedCoupon}
                onClick={() => setCouponModalOpen(false)}
                className={`px-6 py-2 rounded-lg font-semibold transition cursor-pointer ${
                  selectedCoupon
                    ? "bg-blue-bbee text-white hover:bg-blue-bbee/90"
                    : "bg-gray-g3b0 text-gray-gedd cursor-not-allowed"
                }`}
              >
                {lang === "en" ? "Apply" : "ใช้คูปอง"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
