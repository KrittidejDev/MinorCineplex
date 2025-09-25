import SeatAvailable from "@/components/Icons/SeatAvailable";
import SeatBooked from "@/components/Icons/SeatBooked";
import SeatReserved from "@/components/Icons/SeatReserved";
import SeatSelected from "../Icons/SeatSelected";

interface SeatRowProps {
  rowLabel: string;
  seats: {
    id: string;
    row: string;
    status: string;
    price: number;
  }[];
  onSelectSeat: (seatId: string) => void;
}

const SeatRow: React.FC<SeatRowProps> = ({ rowLabel, seats, onSelectSeat }) => {
  const leftSide = seats.slice(0, 5);
  const rightSide = seats.slice(5);

  return (
    <div className="flex max-w-[793px] items-center justify-between gap-10">
      <div className="flex items-center gap-2 justify-between">
        <span className="text-white font-bold">{rowLabel}</span>
        <div className="flex gap-2 lg:gap-4 xl:6">
          {leftSide.map((seat) =>
            seat.status === "reserved" ? (
              <SeatReserved className="w-[clamp(20px,5vw,40px)] h-[clamp(20px,5vw,40px)]" key={seat.id} />
            ) : seat.status === "unavailable" ? (
              <SeatBooked className="w-[clamp(20px,5vw,40px)] h-[clamp(20px,5vw,40px)]" key={seat.id} />
            ) : seat.status === "selected" ? (
              <SeatSelected
                key={seat.id}
                className="w-[clamp(20px,5vw,40px)] h-[clamp(20px,5vw,40px)]"
                onClick={() => onSelectSeat(seat.id)}
              />
            ) : seat.status === "available" ? (
              <SeatAvailable
                key={seat.id}
                className="w-[clamp(20px,5vw,40px)] h-[clamp(20px,5vw,40px)]"
                onClick={() => onSelectSeat(seat.id)}
              />
            ) : (
              <SeatReserved key={seat.id} />
            )
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        <div className="flex gap-2 lg:gap-4 xl:6">
          {rightSide.map((seat) =>
            seat.status === "reserved" ? (
              <SeatReserved className="w-[clamp(20px,5vw,40px)] h-[clamp(20px,5vw,40px)]" key={seat.id} />
            ) : seat.status === "unavailable" ? (
              <SeatBooked className="w-[clamp(20px,5vw,40px)] h-[clamp(20px,5vw,40px)]" key={seat.id} />
            ) : seat.status === "selected" ? (
              <SeatSelected
                key={seat.id}
                className="w-[clamp(20px,5vw,40px)] h-[clamp(20px,5vw,40px)]"
                onClick={() => onSelectSeat(seat.id)}
              />
            ) : seat.status === "available" ? (
              <SeatAvailable
                key={seat.id}
                className="w-[clamp(20px,5vw,40px)] h-[clamp(20px,5vw,40px)]"
                onClick={() => onSelectSeat(seat.id)}
              />
            ) : (
              <SeatReserved key={seat.id} />
            )
          )}
        </div>
        <span className="text-white font-bold">{rowLabel}</span>
      </div>
    </div>
  );
};

export default SeatRow;
