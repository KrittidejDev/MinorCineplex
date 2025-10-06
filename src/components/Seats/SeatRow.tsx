import SeatAvailable from "@/components/Icons/SeatAvailable";
import SeatBooked from "@/components/Icons/SeatBooked";
import SeatReserved from "@/components/Icons/SeatReserved";
import SeatSelected from "@/components/Icons/SeatSelected";

interface Seat {
  id: string;
  seat_id: string;
  seat_number: string;
  row: string;
  col: string;
  status: string;
  price: number;
}

interface SeatRowData {
  row: string;
  seats: Seat[];
}

interface SeatMapProps {
  seats?: SeatRowData[];
  onSelectSeat?: (seatId: string) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, onSelectSeat }) => {
  return (
    <div className="flex flex-col gap-4">
      {seats?.map((rowData) => (
        <div key={rowData.row} className="flex items-center  ">
          <span className="text-white text-center justify-center font-bold w-6">
            {rowData.row}
          </span>

          <div className="flex gap-4 ">
            {rowData.seats.map((seat, index) => {
              const status = seat.status.toLowerCase();
              const SeatIcon =
                status === "reserved"
                  ? SeatReserved
                  : status === "unavailable"
                    ? SeatBooked
                    : status === "selected"
                      ? SeatSelected
                      : SeatAvailable;

              return (
                <div key={seat.id} className={index === 5 ? "ml-[50px]" : ""}>
                  <SeatIcon
                    className="w-[clamp(20px,5vw,40px)] h-[clamp(20px,5vw,40px)] cursor-pointer"
                    onClick={() =>
                      status === "available" && onSelectSeat?.(seat.seat_id)
                    }
                  />
                </div>
              );
            })}
          </div>
          <span className="text-white font-bold text-center justify-center  w-6">
            {rowData.row}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SeatMap;
