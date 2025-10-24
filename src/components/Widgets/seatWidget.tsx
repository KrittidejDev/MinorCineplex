import ScreenBar from "@/components/Seats/ScreenBar";
import SeatInfo from "@/components/Seats/SeatInfo";
import SeatRow from "@/components/Seats/SeatRow";
import { BookingInfo, SelectedSeat } from "@/types/cinema";

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
  console.log("Data seat widget", data);
  return (
    <div className="flex-1 flex flex-col px-4 md:px-6 md:max-w-[672px] items-center gap-y-7 md:gap-y-15">
      <ScreenBar />
      <SeatRow
        seatsData={data?.seats}
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
