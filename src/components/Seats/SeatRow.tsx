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

const SeatRow: React.FC<SeatRowProps> = ({
  seatsData,
  selectedSeats,
  onSelectSeat,
  showtimeId,
  userId,
}) => {
  // state localSeats เพิ่ม locked_by ใน state เท่านั้น
  const [localSeats, setLocalSeats] = useState<
    (Seat & { locked_by?: string | null })[]
  >([]);

  useEffect(() => {
    if (!seatsData) return;
    // แปลง seatsData เป็น localSeats แบบมี locked_by
    const mappedSeats = seatsData.flatMap((rowData) =>
      rowData.seats.map((seat) => ({
        ...seat,
        locked_by: undefined,
      }))
    );
    setLocalSeats(mappedSeats);
  }, [seatsData]);

  useEffect(() => {
    if (!showtimeId) return;
    const channel = ablyClient.channels.get(`showtime:${showtimeId}`);

    const handleUpdate = (message: InboundMessage) => {
      const msg = message as unknown as AblySeatMessage;
      if (!msg?.data) return;

      const { seatId, status, locked_by } = msg.data;

      setLocalSeats((prev) =>
        prev.map((seat) =>
          seat.id === seatId
            ? { ...seat, status, locked_by: locked_by ?? undefined }
            : seat
        )
      );
    };

    channel.subscribe("update", handleUpdate);
    return () => channel.unsubscribe("update", handleUpdate);
  }, [showtimeId]);

  // แปลง Seat เป็น SelectedSeat
  const toSelectedSeat = (
    seat: Seat & { locked_by?: string | null }
  ): SelectedSeat => {
    return {
      id: seat.id,
      seat_number: seat.seat_number,
      row: seat.row,
      status: seat.status,
      price: seat.price || 0,
      locked_by: userId,
      showtimeId: showtimeId,
    };
  };

  const toggleSeat = (seat: Seat & { locked_by?: string | null }) => {
    if (!showtimeId) return;

    const isLockedByOther =
      seat.status === "LOCKED" && seat.locked_by !== userId;
    if (isLockedByOther || seat.status === "BOOKED") return;

    const selectedSeat = toSelectedSeat(seat);

    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      onSelectSeat(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      onSelectSeat([...selectedSeats, selectedSeat]);
    }
  };

  // แปลง localSeats เป็นแถว row สำหรับ render แบบ type-safe
  const seatMap = new Map<string, (Seat & { locked_by?: string | null })[]>();
  localSeats.forEach((seat) => {
    const rowLabel = seat.row;
    if (!seatMap.has(rowLabel)) seatMap.set(rowLabel, []);
    seatMap.get(rowLabel)!.push(seat);
  });

  const rows: [string, (Seat & { locked_by?: string | null })[]][] =
    Array.from(seatMap);

  return (
    <div className="flex flex-col gap-4">
      {rows.map(([rowLabel, seatsInRow]) => (
        <div key={rowLabel} className="flex items-center">
          <span className="text-white font-bold w-6 text-center">
            {rowLabel}
          </span>

          <div className="flex gap-4">
            {seatsInRow.map((seat, index) => {
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
                      onClick={() => !isLockedByOther && toggleSeat(seat)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <span className="text-white font-bold w-6 text-center">
            {rowLabel}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SeatRow;
