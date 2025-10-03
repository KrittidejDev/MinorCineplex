import { seats } from "@/lib/data/mockData";
import { useState } from "react";
import ScreenBar from "@/components/Seats/ScreenBar";
import SeatInfo from "@/components/Seats/SeatInfo";
import SeatRow from "../Seats/SeatRow";

const SeatWidget = () => {
  const [selectSeats, setSelectSeats] = useState(seats);

  const totalSelected = selectSeats.filter(
    (seat) => seat.status === "selected"
  );
  const totalPrice = totalSelected.reduce(
    (acc, seat) => acc + Number(seat.price),
    0
  );

  return (
    <div className="flex flex-col  max-w-[793px] items-center gap-y-15">
      <ScreenBar />
      <SeatRow

      // seats={groupedSeats[row]}
      // onSelectSeat={onSelectSeat}
      />
      <SeatInfo />
    </div>
  );
};

export default SeatWidget;
