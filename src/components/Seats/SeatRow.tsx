import { useEffect, useState } from "react";
import SeatAvailable from "@/components/Icons/SeatAvailable";
import SeatBooked from "@/components/Icons/SeatBooked";
import SeatReserved from "@/components/Icons/SeatReserved";
import SeatSelected from "@/components/Icons/SeatSelected";
import { SeatRowData, SelectedSeat, Seat } from "@/types/cinema";
import { ablyClient } from "@/lib/ably";
import type { InboundMessage } from "ably";

interface SeatRowProps {
  seatsData?: SeatRowData[];
  selectedSeats: SelectedSeat[];
  onSelectSeat: (seats: SelectedSeat[]) => void;
  showtimeId?: string;
  userId?: string;
}

interface AblySeatMessage {
  data: {
    seatId: string;
    status: string;
    locked_by?: string | null;
  };
}

const generateDefaultSeats = (): SeatRowData[] => {
  const rows = ["A", "B", "C", "D", "E"];
  return rows.map((row) => ({
    row,
    seats: Array.from({ length: 10 }, (_, i) => ({
      id: `${row}${i + 1}`,
      seat_number: `${row}${i + 1}`,
      showtime_id: "",
      row,
      col: (i + 1).toString(),
      number: (i + 1).toString(),
      status: "AVAILABLE",
      price: 0,
    })),
  }));
};

const SeatRow: React.FC<SeatRowProps> = ({
  seatsData,
  selectedSeats,
  onSelectSeat,
  showtimeId,
  userId,
}) => {
  const [localSeats, setLocalSeats] = useState<SeatRowData[]>(
    generateDefaultSeats()
  );

  useEffect(() => {
    if (seatsData && seatsData.length > 0) {
      setLocalSeats(seatsData);
    }
  }, [seatsData]);

  useEffect(() => {
    if (!showtimeId) return;
    const channel = ablyClient.channels.get(`showtime:${showtimeId}`);

    const handleUpdate = (message: InboundMessage) => {
      const msg = message as unknown as AblySeatMessage;
      if (!msg?.data) return;

      const { seatId, status } = msg.data;
      const isValidStatus = (s: string): s is Seat["status"] =>
        ["AVAILABLE", "RESERVED", "BOOKED", "LOCKED"].includes(s);

      setLocalSeats((prev) =>
        prev.map((row) => ({
          ...row,
          seats: row.seats.map((seat) =>
            seat.id === seatId
              ? {
                  ...seat,
                  status: isValidStatus(status) ? status : seat.status,
                }
              : seat
          ),
        }))
      );
    };

    channel.subscribe("update", handleUpdate);
    return () => channel.unsubscribe("update", handleUpdate);
  }, [showtimeId]);

  const toSelectedSeat = (
    seat: Seat & { locked_by?: string | null }
  ): SelectedSeat => ({
    id: seat.id,
    seat_number: seat.seat_number,
    row: seat.row,
    price: seat.price || 0,
  });

  const toggleSeat = (seat: Seat & { locked_by?: string | null }) => {
    if (!showtimeId) return;

    const isLockedByOther =
      seat.status === "LOCKED" && seat.locked_by_user_id !== userId;
    if (isLockedByOther || seat.status === "BOOKED") return;

    const selectedSeat = toSelectedSeat(seat);
    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      onSelectSeat(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      onSelectSeat([...selectedSeats, selectedSeat]);
    }
  };

  console.log("seat data", seatsData);

  return (
    <div className="flex flex-col gap-[14px] md:gap-4">
      {localSeats.map((rowData, i) => (
        <div key={i} className="flex items-center">
          <span className="text-white font-bold w-6 text-center text-[7.47px] md:text-fm-16">
            {rowData.row}
          </span>
          <div className="flex gap-3 md:gap-4">
            {rowData.seats.map((seat, index) => {
              const isSelected = selectedSeats.some((s) => s.id === seat.id);
              const isLockedByOther =
                seat.status === "LOCKED" && seat.locked_by_user_id !== userId;

              const SeatIcon = isSelected
                ? SeatSelected
                : seat.status === "LOCKED"
                  ? SeatReserved
                  : seat.status === "BOOKED"
                    ? SeatBooked
                    : SeatAvailable;

              return (
                <div key={seat.id} className="flex flex-col items-center">
                  <SeatIcon
                    className={`w-[clamp(20px,5vw,40px)] h-[clamp(20px,5vw,40px)]
                      ${isLockedByOther ? "cursor-not-allowed opacity-50" : "cursor-pointer"} 
                      ${index === 5 ? "ml-2 sm:ml-4 md:ml-12" : ""}
                    `}
                    onClick={() => !isLockedByOther && toggleSeat(seat)}
                  />
                </div>
              );
            })}
          </div>
          <span className="text-white font-bold w-6 text-center text-[7.47px] md:text-fm-16">
            {rowData.row}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SeatRow;
