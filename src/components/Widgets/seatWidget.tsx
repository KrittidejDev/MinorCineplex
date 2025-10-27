import ScreenBar from "@/components/Seats/ScreenBar";
import SeatInfo from "@/components/Seats/SeatInfo";
import SeatRow from "@/components/Seats/SeatRow";
import { BookingInfo, SelectedSeat } from "@/types/cinema";

interface SeatWidgetProps {
  data?: BookingInfo | null;
  selectedSeats: SelectedSeat[];
  onSelectSeat: (seatIds: SelectedSeat[]) => void;
  userId?: string;
  fid?: string | null;
  hall: string;
}

const SeatWidget: React.FC<SeatWidgetProps> = ({
  data,
  selectedSeats,
  onSelectSeat,
  userId,
  fid,
  hall,
}) => {
  return (
    <div className="flex-1 flex flex-col px-4 md:px-6 md:max-w-[672px] items-center gap-y-7 md:gap-y-15">
      <ScreenBar />
      <SeatRow
        seatsData={data?.seats}
        fid={fid}
        selectedSeats={selectedSeats}
        onSelectSeat={onSelectSeat}
        showtimeId={data?.id}
        userId={userId}
      />
      <SeatInfo price={data?.price} fid={fid} hall={hall} />
    </div>
  );
};

export default SeatWidget;
