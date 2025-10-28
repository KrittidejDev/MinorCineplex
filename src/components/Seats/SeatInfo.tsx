import SeatAvailable from "@/components/Icons/SeatAvailable";
import SeatBooked from "@/components/Icons/SeatBooked";
import SeatReserved from "@/components/Icons/SeatReserved";
import SeatFriend from "../Icons/SeatFriend";
import { useTranslation } from "next-i18next";

type SeatInfoProps = {
  price?: string | number;
  fid?: string | null;
  hall: string;
};

const SeatInfo: React.FC<SeatInfoProps> = ({ price, fid, hall }) => {
  const { t } = useTranslation("common");
  return (
  <div className="w-full flex flex-col sm:flex-row border-t border-gray-gedd gap-10 py-4">
    <div className="bg-gray-g63f max-w-[88px] py-3 px-4 rounded-sm whitespace-nowrap h-fit">
      <h1 className="text-f-24 text-gray-gedd ">{hall}</h1>
    </div>
    <div className="flex flex-wrap gap-7">
      <div className="flex gap-4 items-center">
        <SeatAvailable className="" />
        <div className="flex flex-col justify-center">
          <p className="text-gray-gedd">{t("Available Seat")}</p>
          <p className="text-gray-gedd">THB {price}</p>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <SeatBooked />
        <p className="text-gray-gedd">{t("Booked Seat")}</p>
      </div>
      <div className="flex gap-4 items-center">
        <SeatReserved />
        <p className="text-gray-gedd">{t("Reserved Seat")}</p>
      </div>
      {fid && (
        <div className="flex gap-4 items-center">
          <SeatFriend />
          <p className="text-gray-gedd">{t("Friend's Seat")}</p>
        </div>
      )}
    </div>
  </div>
  );
};

export default SeatInfo;
