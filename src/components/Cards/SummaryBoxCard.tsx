import Image from "next/image";
import Tag from "../Widgets/Tag";
import PinFill from "../Icons/PinFill";
import DateRangeFill from "../Icons/DateRangeFill";
import TimeFill from "../Icons/TimeFill";
import Shop from "../Icons/Shop";
import BookingInfo from "./BookingInfo";
import { useTranslation } from "react-i18next";
import { BillInfo } from "@/types/cinema";
import { Button } from "../ui/button";
import { CouponCardData } from "@/types/coupon";

interface Props extends BillInfo {
  countdown?: string;
  coupons?: CouponCardData[];
  selectedCoupon?: CouponCardData | null;
  onSelectCoupon?: (coupon: CouponCardData) => void;
  onPayment?: () => void;
}

function SummaryBoxCard({
  data,
  totalSelected,
  totalPrice,
  lockSeats,
  step,
  countdown,
  coupons = [],
  selectedCoupon,
  onSelectCoupon,
  onPayment,
}: Props) {
  const { i18n } = useTranslation();
  const locale = i18n.language || "en";

  return (
    <div className="w-full max-w-full lg:max-w-[305px] h-fit bg-gray-gc1b rounded-lg">
      <div className="p-4">
        {step === "2" && (
          <p className="text-sm text-gray-g3b0 pb-3">
            Time remaining:{" "}
            <span className="text-sm text-blue-bbee pl-2">{countdown}</span>
          </p>
        )}

        <div className="flex gap-4 items-center">
          <Image
            src={data?.movie?.poster_url || "/default-poster.jpg"}
            alt={data?.movie?.title || "Movie Poster"}
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
                  locale === "en" ? "en-US" : "th-TH",
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

      {step === "1" && totalSelected && totalSelected.length > 0 && (
        <BookingInfo
          totalSelected={totalSelected}
          totalPrice={totalPrice}
          lockSeats={lockSeats}
        />
      )}

      {step === "2" && (
        <div className="p-4 flex flex-col gap-4">
          {coupons.length > 0 && (
            <select
              value={selectedCoupon?.id || ""}
              onChange={(e) => {
                const coupon = coupons.find((c) => c.id === e.target.value);
                if (coupon && onSelectCoupon) onSelectCoupon(coupon);
              }}
              className="w-full p-2 rounded bg-gray-g3b0 text-white"
            >
              <option value="">Select Coupon</option>
              {coupons.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.discount}%
                </option>
              ))}
            </select>
          )}
          <Button className="btn-base blue-normal" onClick={onPayment}>
            Pay Now
          </Button>
        </div>
      )}
    </div>
  );
}

export default SummaryBoxCard;
