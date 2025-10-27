import { useEffect, useState } from "react";
import SeatAvailable from "@/components/Icons/SeatAvailable";
import SeatBooked from "@/components/Icons/SeatBooked";
import SeatReserved from "@/components/Icons/SeatReserved";
import SeatSelected from "@/components/Icons/SeatSelected";
import { SeatRowData, SelectedSeat, Seat } from "@/types/cinema";
import { ablyClient } from "@/lib/ably";
import type { InboundMessage } from "ably";
import SeatFriend from "../Icons/SeatFriend";

interface SeatRowProps {
  seatsData?: SeatRowData[];
  selectedSeats: SelectedSeat[];
  onSelectSeat: (seats: SelectedSeat[]) => void;
  showtimeId?: string;
  userId?: string;
  fid?: string | null;
}

interface AblySeatMessage {
  data: {
    seatId: string;
    status: string;
    locked_by_user_id?: string | null;
    locked_until?: string | null;
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
  fid,
}) => {
  const [localSeats, setLocalSeats] = useState<SeatRowData[]>(
    generateDefaultSeats()
  );

  useEffect(() => {
    if (seatsData && seatsData.length > 0) {
      console.log("Updating localSeats with new seatsData:", seatsData);
      setLocalSeats(seatsData);
    } else {
      console.warn("No seatsData provided, using default seats");
      setLocalSeats(generateDefaultSeats());
    }
  }, [seatsData]);

  useEffect(() => {
    if (!showtimeId) {
      console.warn("No showtimeId provided, skipping Ably subscription");
      return;
    }

    const channel = ablyClient.channels.get(`showtime:${showtimeId}`);

    const handleUpdate = (message: InboundMessage) => {
      const msg = message as unknown as AblySeatMessage;
      if (!msg?.data) {
        console.error("Invalid Ably message data:", msg);
        return;
      }

      const { seatId, status, locked_by_user_id, locked_until } = msg.data;
      console.log("Ably seat update received:", {
        seatId,
        status,
        locked_by_user_id,
        locked_until,
      });

      const isValidStatus = (s: string): s is Seat["status"] =>
        ["AVAILABLE", "RESERVED", "BOOKED", "LOCKED"].includes(s);

      if (!isValidStatus(status)) {
        console.error("Invalid seat status received:", status);
        return;
      }

      const isLockExpired = locked_until
        ? new Date(locked_until).getTime() < Date.now()
        : false;

      setLocalSeats((prev) =>
        prev.map((row) => ({
          ...row,
          seats: row.seats.map((seat) =>
            seat.id === seatId
              ? {
                  ...seat,
                  status: isLockExpired ? "AVAILABLE" : status,
                  locked_by_user_id: isLockExpired
                    ? null
                    : (locked_by_user_id ?? seat.locked_by_user_id),
                  locked_until: isLockExpired
                    ? null
                    : locked_until
                      ? new Date(locked_until).getTime()
                      : seat.locked_until,
                }
              : seat
          ),
        }))
      );
    };

    channel.subscribe("update", handleUpdate);
    console.log(`Subscribed to Ably channel showtime:${showtimeId}`);

    return () => {
      channel.unsubscribe("update", handleUpdate);
      console.log(`Unsubscribed from Ably channel showtime:${showtimeId}`);
    };
  }, [showtimeId]);

  const toSelectedSeat = (
    seat: Seat & {
      locked_by_user_id?: string | null;
      locked_until?: number | null;
    }
  ): SelectedSeat => ({
    id: seat.id,
    seat_number: seat.seat_number,
    row: seat.row,
    price: seat.price || 0,
  });

  const toggleSeat = (
    seat: Seat & {
      locked_by_user_id?: string | null;
      locked_until?: number | null;
    }
  ) => {
    if (!showtimeId || !userId) {
      console.warn("Missing showtimeId or userId, cannot toggle seat");
      return;
    }

    const isLockExpired = seat.locked_until
      ? seat.locked_until < Date.now()
      : false;
    const isLockedByOther =
      seat.status === "LOCKED" &&
      seat.locked_by_user_id !== userId &&
      !isLockExpired;

    if (isLockedByOther || seat.status === "BOOKED") {
      console.log(`Cannot toggle seat ${seat.id}:`, {
        status: seat.status,
        isLockedByOther,
        locked_until: seat.locked_until,
      });
      return;
    }

    const selectedSeat = toSelectedSeat(seat);
    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      onSelectSeat(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      onSelectSeat([...selectedSeats, selectedSeat]);
    }
    console.log(`Toggled seat ${seat.id}, selected: ${!isSelected}`);
  };

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
              const isLockExpired = seat.locked_until
                ? seat.locked_until < Date.now()
                : false;
              const isLockedByOther =
                seat.status === "BOOKED" ||
                (!isLockExpired && seat.status === "LOCKED") ||
                (fid && seat.locked_by_user_id === fid);

              let SeatIcon;
              if (isSelected) SeatIcon = SeatSelected;
              else if (fid && seat.locked_by_user_id === fid && !isLockExpired)
                SeatIcon = SeatFriend;
              else if (seat.status === "BOOKED") SeatIcon = SeatBooked;
              else if (seat.status === "LOCKED" && !isLockExpired)
                SeatIcon = SeatReserved;
              else SeatIcon = SeatAvailable;

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
