import { useEffect, useState } from "react";
import ScreenBar from "@/components/Seats/ScreenBar";
import SeatInfo from "@/components/Seats/SeatInfo";
import SeatRow from "@/components/Seats/SeatRow";
import { BookingInfo, SelectedSeat, SeatRowData } from "@/types/cinema";
import { ablyClient } from "@/lib/ably";

interface SeatWidgetProps {
  data?: BookingInfo | null;
  selectedSeats: SelectedSeat[];
  onSelectSeat: (seatIds: SelectedSeat[]) => void;
  userId?: string;
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

    const handleUpdate = (msg: any) => {
      const { seatId, status, locked_by } = msg.data;
      setSeatsData((prev) =>
        prev.map((row) => ({
          ...row,
          seats: row.seats.map((seat) =>
            seat.id === seatId ? { ...seat, status, locked_by } : seat
          ),
        }))
      );
    };

    channel.subscribe("update", handleUpdate);
    return () => channel.unsubscribe("update", handleUpdate);
  }, [data?.id]);

  return (
    <div className="flex flex-col max-w-[793px] items-center gap-y-15">
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
