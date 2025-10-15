import { useEffect, useState } from "react";
import ScreenBar from "@/components/Seats/ScreenBar";
import SeatInfo from "@/components/Seats/SeatInfo";
import SeatRow from "@/components/Seats/SeatRow";
import { BookingInfo, SelectedSeat, SeatRowData } from "@/types/cinema";
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

const SeatWidget: React.FC<SeatWidgetProps> = ({
  data,
  selectedSeats,
  onSelectSeat,
  userId,
}) => {
  const [seatsData, setSeatsData] = useState<SeatRowData[]>(data?.seats || []);

  useEffect(() => {
    if (data?.seats) setSeatsData(data.seats);
  }, [data?.seats]);

  useEffect(() => {
    if (!data?.id) return;
    const channel = ablyClient.channels.get(`showtime:${data.id}`);

    const handleUpdate = (msg: InboundMessage) => {
      // msg.data เป็น any หรือ object จริง ๆ ต้อง cast
      const payload = msg.data as AblySeatUpdateMessage;
      const { seatId, status, locked_by } = payload;

      setSeatsData((prev) =>
        prev.map((row) => ({
          ...row,
          seats: row.seats.map((seat) =>
            seat.id === seatId
              ? {
                  ...seat,
                  status,
                  // แปลง null เป็น undefined
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
    <div className="w-dvw flex flex-col max-w-[343px] md:max-w-[672px] items-center gap-y-7 md:gap-y-15">
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
