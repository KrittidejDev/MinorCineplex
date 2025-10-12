import { useEffect, useState } from "react";
import SeatAvailable from "@/components/Icons/SeatAvailable";
import SeatBooked from "@/components/Icons/SeatBooked";
import SeatReserved from "@/components/Icons/SeatReserved";
import SeatSelected from "@/components/Icons/SeatSelected";
import { SeatRowData, SelectedSeat, Seat } from "@/types/cinema";
import { ablyClient } from "@/lib/ably";

interface SeatRowProps {
  seatsData?: SeatRowData[];
  selectedSeats: SelectedSeat[];
  onSelectSeat: (seats: SelectedSeat[]) => void;
  showtimeId?: string;
  userId?: string;
}

const SeatRow: React.FC<SeatRowProps> = ({
  seatsData,
  selectedSeats,
  onSelectSeat,
  showtimeId,
  userId,
}) => {
  const [now, setNow] = useState(Date.now());
  const [localSeats, setLocalSeats] = useState<SeatRowData[]>(seatsData || []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seatsData) setLocalSeats(seatsData);
  }, [seatsData]);

  useEffect(() => {
    if (!showtimeId) return;
    const channel = ablyClient.channels.get(`showtime:${showtimeId}`);
    const handleUpdate = (msg: any) => {
      const { seatId, status, lockExpire } = msg.data;
      setLocalSeats((prev) =>
        prev.map((row) => ({
          ...row,
          seats: row.seats.map((seat) =>
            seat.id === seatId ? { ...seat, status, lockExpire } : seat
          ),
        }))
      );
    };
    channel.subscribe("update", handleUpdate);
    return () => {
      channel.unsubscribe("update", handleUpdate);
    };
  }, [showtimeId]);

  const toSelectedSeat = (seat: Seat): SelectedSeat | null => {
    if (!seat.seat_number) return null;
    return {
      id: seat.id,
      seat_number: seat.seat_number,
      row: seat.row || "",
      status: seat.status,
      price: seat.price || 0,
      lockExpire: seat.lockExpire,
      showtimeId: showtimeId,
    };
  };

  const toggleSeat = (seat: Seat) => {
    if (seat.status.toUpperCase() !== "AVAILABLE") return;
    const selectedSeat = toSelectedSeat(seat);
    if (!selectedSeat) return;

    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    if (isSelected) {
      onSelectSeat(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      onSelectSeat([...selectedSeats, selectedSeat]);
    }
  };

  const formatCountdown = (expire: number) => {
    const diff = Math.max(Math.floor((expire - now) / 1000), 0);
    const m = Math.floor(diff / 60)
      .toString()
      .padStart(2, "0");
    const s = (diff % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalSeats((prevSeats) =>
        prevSeats.map((row) => ({
          ...row,
          seats: row.seats.map((seat) => {
            if (
              seat.status === "LOCKED" &&
              seat.lockExpire &&
              seat.lockExpire <= Date.now()
            ) {
              const channel = ablyClient.channels.get(`showtime:${showtimeId}`);
              channel.publish("update", {
                seatId: seat.id,
                status: "AVAILABLE",
              });
              return {
                ...seat,
                status: "AVAILABLE",
                lockExpire: undefined,
                lockedBy: undefined,
              };
            }
            return seat;
          }),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [showtimeId]);

  return (
    <div className="flex flex-col gap-4">
      {localSeats.map((rowData) => (
        <div key={rowData.row} className="flex items-center">
          <span className="text-white font-bold w-6 text-center">
            {rowData.row}
          </span>
          <div className="flex gap-4">
            {rowData.seats.map((seat, index) => {
              const isSelected = selectedSeats.some((s) => s.id === seat.id);
              let SeatIcon;
              if (isSelected) SeatIcon = SeatSelected;
              else if (seat.status === "LOCKED") SeatIcon = SeatReserved;
              else if (seat.status === "BOOKED") SeatIcon = SeatBooked;
              else SeatIcon = SeatAvailable;

              return (
                <div key={seat.id}>
                  <div className="flex flex-col items-center">
                    <SeatIcon
                      className={`w-[clamp(20px,5vw,40px)] h-[clamp(20px,5vw,40px)] cursor-pointer ${
                        seat.status !== "AVAILABLE" ? "cursor-not-allowed" : ""
                      } ${index === 5 && "ml-20"}`}
                      onClick={() => toggleSeat(seat)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <span className="text-white font-bold w-6 text-center">
            {rowData.row}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SeatRow;
