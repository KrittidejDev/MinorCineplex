import { useEffect, useState } from "react";
import ScreenBar from "@/components/Seats/ScreenBar";
import SeatInfo from "@/components/Seats/SeatInfo";
import SeatRow from "@/components/Seats/SeatRow";
import { BookingInfo, SelectedSeat, SeatRowData, Seat } from "@/types/cinema";
import { ablyClient } from "@/lib/ably";
import type { InboundMessage } from "ably";

interface SeatWidgetProps {
  data?: BookingInfo | null;
  selectedSeats: SelectedSeat[];
  onSelectSeat: (seatIds: SelectedSeat[]) => void;
  userId?: string;
}

interface AblySeatUpdateMessage {
  seatId: string;
  status: string;
  locked_by?: string | null;
}

const generateDefaultSeatsData = (): SeatRowData[] => {
  const rows = ["A", "B", "C", "D", "E"];
  return rows.map((row) => ({
    row,
    seats: Array.from({ length: 10 }, (_, i) => ({
      id: `${row}${i + 1}`,
      seat_number: `${row}${i + 1}`,
      row,
      col: (i + 1).toString(),
      number: (i + 1).toString(),
      status: "AVAILABLE" as const,
      seat: {
        id: `${row}${i + 1}`,
        seat_number: `${row}${i + 1}`,
        row,
        col: (i + 1).toString(),
      },
    })),
  }));
};

const SeatWidget: React.FC<SeatWidgetProps> = ({
  data,
  selectedSeats,
  onSelectSeat,
  userId,
}) => {
  const [seatsData, setSeatsData] = useState<SeatRowData[]>(
    data?.seats || generateDefaultSeatsData()
  );

  useEffect(() => {
    if (data?.seats && data.seats.length > 0) setSeatsData(data.seats);
  }, [data?.seats]);

  useEffect(() => {
    if (!data?.id) return;
    const channel = ablyClient.channels.get(`showtime:${data.id}`);
    const handleUpdate = (msg: InboundMessage) => {
      const payload = msg.data as AblySeatUpdateMessage;
      const { seatId, status, locked_by } = payload;

      const isValidStatus = (s: string): s is Seat["status"] =>
        ["AVAILABLE", "RESERVED", "BOOKED", "LOCKED"].includes(s);

      setSeatsData((prev) =>
        prev.map((row) => ({
          ...row,
          seats: row.seats.map((seat) =>
            seat.id === seatId
              ? {
                  ...seat,
                  status: isValidStatus(status) ? status : seat.status,
                  locked_by: locked_by ?? undefined,
                }
              : seat
          ),
        }))
      );
    };

    channel.subscribe("update", handleUpdate);
    return () => channel.unsubscribe("update", handleUpdate);
  }, [data?.id]);

  return (
    <div className="flex-1 flex flex-col px-4 md:px-6 md:max-w-[672px] items-center gap-y-7 md:gap-y-15">
      <ScreenBar />
      <SeatRow
        seatsData={seatsData}
        selectedSeats={selectedSeats}
        onSelectSeat={onSelectSeat}
        showtimeId={data?.id}
        userId={userId}
      />
      <SeatInfo price={data?.price} />
    </div>
  );
};

export default SeatWidget;
