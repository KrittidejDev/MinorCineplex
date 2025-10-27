import React, { useEffect, useState } from "react";
import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import SuccessBooking from "@/components/Icons/SuccessBooking";
import PinFill from "@/components/Icons/PinFill";
import DateRangeFill from "@/components/Icons/DateRangeFill";
import TimeFill from "@/components/Icons/TimeFill";
import Shop from "@/components/Icons/Shop";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ShareButton from "@/components/Widgets/ShareButton";

interface BookingData {
  cinema_name: { th: string; en: string };
  movie_title: { th: string; en: string };
  date: { th: string; en: string };
  time: string;
  hall: { th: string; en: string };
  seats: string[];
  payment_method: { th: string; en: string };
  total_price: number;
}

const BookingSuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const public_id = searchParams.get("pid");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { i18n } = useTranslation();
  const lang = i18n.language as "th" | "en";

  const fetchBookingData = async () => {
    try {
      const response = await axios.get(`/api/booking/success/${public_id}`);
      if (response.data.success) {
        setBookingData(response.data.data);
      } else {
        setError(response.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการดึงข้อมูลการจอง");
    }
  };

  useEffect(() => {
    if (public_id) {
      fetchBookingData();
    }
  }, [public_id]);

  if (error) {
    return (
      <NavAndFooter>
        <div className="flex flex-1 flex-col items-center py-10 md:py-[106px]">
          <div className="text-f-36 text-red-500">{error}</div>
        </div>
      </NavAndFooter>
    );
  }

  if (!bookingData) {
    return (
      <NavAndFooter>
        <div className="flex flex-1 flex-col items-center py-10 md:py-[106px]">
          <div className="text-f-36">
            {lang === "th" ? "กำลังโหลด..." : "Loading..."}
          </div>
        </div>
      </NavAndFooter>
    );
  }

  return (
    <NavAndFooter>
      <div className="flex flex-1 flex-col items-center py-10 md:py-[106px]">
        <div className="mb-6">
          <SuccessBooking />
        </div>
        <div className="text-f-36 mb-12">
          {lang === "th" ? "การจองสำเร็จ" : "Booking Success"}
        </div>
        <div className="p-6 rounded-2xl bg-gray-gc1b w-full max-w-[386px] flex flex-col mb-12">
          <div className="mb-2 flex items-center gap-x-3">
            <PinFill width={16} height={16} color="#565F7E" />
            <span className="text-fr-16">{bookingData.cinema_name[lang]}</span>
          </div>
          <div className="mb-2 flex items-center gap-x-3">
            <DateRangeFill width={16} height={16} color="#565F7E" />
            <span className="text-fr-16">{bookingData.date[lang]}</span>
          </div>
          <div className="mb-2 flex items-center gap-x-3">
            <TimeFill width={16} height={16} color="#565F7E" />
            <span className="text-fr-16">{bookingData.time}</span>
          </div>
          <div className="mb-4 flex items-center gap-x-3">
            <Shop width={16} height={16} color="#565F7E" />
            <span className="text-fr-16">{bookingData.hall[lang]}</span>
          </div>
          <div className="border-b-2 border-b-gray-g63f mb-4" />
          <div className="text-fr-16 text-gray-g3b0 flex items-center mb-2">
            <span className="w-30">
              {lang === "th" ? "ที่นั่งที่เลือก" : "Selected Seats"}
            </span>
            <span className="font-bold text-white">
              {bookingData.seats.join(", ")}
            </span>
          </div>
          <div className="text-fr-16 text-gray-g3b0 flex items-center mb-2">
            <span className="w-30">
              {lang === "th" ? "วิธีการชำระเงิน" : "Payment Method"}
            </span>
            <span className="font-bold text-white">
              {bookingData.payment_method[lang]}
            </span>
          </div>
          <div className="text-fr-16 text-gray-g3b0 flex items-center mb-2">
            <span className="w-30">{lang === "th" ? "ราคารวม" : "Total"}</span>
            <span className="font-bold text-white">
              ฿{bookingData.total_price}
            </span>
          </div>
        </div>
        <div className="my-8 flex gap-3">
          <Link href="/">
            <Button className="btn-base white-outline-normal text-fm-16 font-bold!">
              Back to home
            </Button>
          </Link>
          <Link href={`/booking/detail/${public_id}`}>
            <Button className="btn-base blue-normal text-fm-16 font-bold!">
              Booking detail
            </Button>
          </Link>
        </div>
        <ShareButton publicId={public_id || ""} text="Share This Booking" />
      </div>
    </NavAndFooter>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "booking"])),
    },
  };
}
export default BookingSuccessPage;
