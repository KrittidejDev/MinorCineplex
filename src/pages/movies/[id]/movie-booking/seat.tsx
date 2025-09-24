import NavBarWidget from "@/components/Widgets/NavBarWidget";
import { Stepper } from "@/components/Widgets/Stepper";
import { seats } from "@/lib/data/mockData";
import { useState } from "react";
import SummaryBoxCard from "@/components/Cards/SummaryBoxCard";
import ScreenBar from "@/components/Seats/ScreenBar";
import SeatGrid from "@/components/Seats/SeatGrid";
import SeatInfo from "@/components/Seats/SeatInfo";

const SelectSeat = () => {
  const [selectSeats, setSelectSeats] = useState(seats);

  const groupedSeats = selectSeats.reduce(
    (acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    },
    {} as Record<string, typeof seats>
  );

  const handleSelectSeat = (seatId: string) => {
    setSelectSeats((prev) =>
      prev.map((seat) =>
        seat.id === seatId
          ? seat.status === "reserved" && "booked"
            ? seat
            : {
                ...seat,
                status: seat.status === "available" ? "selected" : "available",
              }
          : seat
      )
    );
  };

  const totalSelected = selectSeats.filter(
    (seat) => seat.status === "selected"
  );
  const totalPrice = totalSelected.reduce(
    (acc, seat) => acc + Number(seat.price),
    0
  );

  return (
    <>
      <NavBarWidget />
      <div className="w-full h-26 flex justify-center items-center bg-gray-gc1b">
        <Stepper />
      </div>
      <div className="mx-auto flex justify-between items-start bg-[#101525] w-full max-w-[1440px] px-30 py-20">
        <div className="flex flex-col gap-15 w-[793px]">
          <ScreenBar />
          <SeatGrid
            groupedSeats={groupedSeats}
            onSelectSeat={handleSelectSeat}
          />
          <SeatInfo />
        </div>
        <SummaryBoxCard totalSelected={totalSelected} totalPrice={totalPrice} />
      </div>
    </>
  );
};

export default SelectSeat;
