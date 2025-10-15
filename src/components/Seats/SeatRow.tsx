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
    status: Seat["status"];
    locked_by?: string | null;
  };
}

const SeatRow: React.FC<SeatRowProps> = ({
  seatsData,
  selectedSeats,
  onSelectSeat,
  showtimeId,
  userId,
}) => {
  const [localSeats, setLocalSeats] = useState<SeatRowData[]>(seatsData || []);

  useEffect(() => {
    if (seatsData) setLocalSeats(seatsData);
  }, [seatsData]);

  useEffect(() => {
    if (!showtimeId) return;
    const channel = ablyClient.channels.get(`showtime:${showtimeId}`);

    const handleUpdate = (message: InboundMessage) => {
      const msg = message as unknown as AblySeatMessage; // ✅ แปลง type ภายใน ไม่กระทบโฟลว์
      if (!msg?.data) return;

      const { seatId, status, locked_by } = msg.data;

      setLocalSeats((prev) =>
        prev.map((row) => ({
          ...row,
          seats: row.seats.map((seat) =>
            seat.id === seatId
              ? { ...seat, status, locked_by: locked_by ?? undefined }
              : seat
          ),
        }))
      );
    };

    channel.subscribe("update", handleUpdate);
    return () => channel.unsubscribe("update", handleUpdate);
  }, [showtimeId]);

  const toSelectedSeat = (seat: Seat): SelectedSeat | null =>
    seat.seat_number
      ? {
          id: seat.id,
          seat_number: seat.seat_number,
          row: seat.row || "",
          status: seat.status,
          price: seat.price || 0,
          locked_by: userId,
          showtimeId: showtimeId,
        }
      : null;

  const toggleSeat = (seat: Seat) => {
    if (!showtimeId) return;

    const isLockedByOther =
      seat.status === "LOCKED" && seat.locked_by !== userId;
    if (isLockedByOther || seat.status === "BOOKED") return;

    const selectedSeat = toSelectedSeat(seat);
    if (!selectedSeat) return;

    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      onSelectSeat(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      onSelectSeat([...selectedSeats, selectedSeat]);
    }
  };

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
              const isLockedByOther =
                seat.status === "LOCKED" && seat.locked_by !== userId;

              const SeatIcon = isSelected
                ? SeatSelected
                : seat.status === "LOCKED"
                  ? SeatReserved
                  : seat.status === "BOOKED"
                    ? SeatBooked
                    : SeatAvailable;

              return (
                <div key={seat.id}>
                  <div className="flex flex-col items-center">
                    <SeatIcon
                      className={`w-[clamp(20px,5vw,40px)] h-[clamp(20px,5vw,40px)]
                        ${isLockedByOther ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                        ${index === 5 ? "ml-20" : ""}`}
                      onClick={() =>
                        !isLockedByOther ? toggleSeat(seat) : undefined
                      }
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
