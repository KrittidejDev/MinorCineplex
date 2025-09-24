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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <span className="text-white font-bold">{rowLabel}</span>
        <div className="flex gap-6">
          {leftSide.map((seat) =>
            seat.status === "reserved" ? (
              <SeatReserved width={40} height={40} key={seat.id} />
            ) : seat.status === "unavailable" ? (
              <SeatBooked width={40} height={40} key={seat.id} />
            ) : seat.status === "selected" ? (
              <SeatSelected
                key={seat.id}
                width={40}
                height={40}
                onClick={() => onSelectSeat(seat.id)}
              />
            ) : seat.status === "available" ? (
              <SeatAvailable
                key={seat.id}
                width={40}
                height={40}
                onClick={() => onSelectSeat(seat.id)}
              />
            ) : (
              <SeatReserved key={seat.id} />
            )
          )}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex gap-6">
          {rightSide.map((seat) =>
            seat.status === "reserved" ? (
              <SeatReserved width={40} height={40} key={seat.id} />
            ) : seat.status === "unavailable" ? (
              <SeatBooked width={40} height={40} key={seat.id} />
            ) : seat.status === "selected" ? (
              <SeatSelected
                key={seat.id}
                width={40}
                height={40}
                onClick={() => onSelectSeat(seat.id)}
              />
            ) : seat.status === "available" ? (
              <SeatAvailable
                key={seat.id}
                width={40}
                height={40}
                onClick={() => onSelectSeat(seat.id)}
              />
            ) : (
              <SeatReserved key={seat.id} />
            )
          )}
        </div>
        <span className="w-6 text-white font-bold">{rowLabel}</span>
      </div>
    </div>
  );
};

export default SeatRow;
