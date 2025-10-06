import Image from "next/image";
import Tag from "../Widgets/Tag";
import PinFill from "../Icons/PinFill";
import DateRangeFill from "../Icons/DateRangeFill";
import TimeFill from "../Icons/TimeFill";
import Shop from "../Icons/Shop";
import BookingInfo from "./BookingInfo";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface BillInfo {
  totalSelected?: {
    id: string;
    row: string;
    status: string;
    price: number;
  }[];
  totalPrice?: number;
}

function SummaryBoxCard({ data, totalSelected, totalPrice }: BillInfo) {
  const [step, setStep] = useState("1");

  const i18n = useTranslation();

  return (
    <>
      <div className="w-full max-w-full lg:max-w-[305px] h-fit bg-gray-gc1b rounded-lg">
        <div className="p-4">
          {step === "2" && (
            <p className="text-sm text-gray-g3b0 pb-3">
              Time remaining:{" "}
              <span className="text-sm text-blue-bbee pl-2">04:55</span>
            </p>
          )}
          <div className="flex gap-4 items-center">
            <Image
              src={data?.movie?.poster_url}
              alt={data?.movie?.title}
              width={82.21}
              height={120}
              className="object-cover rounded-md"
            />
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-xl text-white-wfff line-clamp-2">
                {data?.movie?.title}
              </h4>
              <div className="hidden sm:flex flex-wrap gap-2">
                {data?.movie?.genre.split(",").map((e, i) => (
                  <div key={i}>
                    <Tag name={e} variant="genre" />
                  </div>
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
                    i18n.language === "en" ? "en-US" : "th-TH",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
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
        {!totalSelected ||
          (totalSelected?.length > 0 && (
            <BookingInfo
              totalSelected={totalSelected}
              totalPrice={totalPrice}
            />
          ))}
      </div>
    </>
  );
}

export default SummaryBoxCard;
