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
    <div className="w-full bg-gray-gc1b">
      <NavBarWidget />
      <div className="p-4 flex justify-center items-center">
        <Stepper />
      </div>
      <div
        className="w-full flex justify-center bg-[#101525] px-1 py-10 md:py-20">
        <div className="w-full max-w-[1440px] md:px-4 lg:gap-10 xl:gap-24 flex flex-col items-center lg:flex-row justify-center lg:items-start">
          <div className="flex flex-col w-full max-w-[793px] px-4 py-10 items-center gap-15">
            <ScreenBar />
            <SeatGrid
              groupedSeats={groupedSeats}
              onSelectSeat={handleSelectSeat}
            />
            <SeatInfo />
          </div>
          <div className="w-full max-w-[475px] lg:max-w-[305px] flex justify-center px-1 lg:py-10">
            <SummaryBoxCard
              totalSelected={totalSelected}
              totalPrice={totalPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectSeat;
