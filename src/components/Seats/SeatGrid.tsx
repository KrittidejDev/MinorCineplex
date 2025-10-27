import SeatRow from "./SeatRow";
import { SeatRowData, SelectedSeat, Seat } from "@/types/cinema";

interface SeatGridProps {
  groupedSeats: Record<
    string,
    {
      id: string;
      row: string;
      status: string;
      price: number;
      seat_number?: string;
      col?: string;
    }[]
  >;
  selectedSeats: SelectedSeat[];
  onSelectSeat: (seats: SelectedSeat[]) => void;
  showtimeId?: string;
  userId?: string;
}

const SeatGrid: React.FC<SeatGridProps> = ({
  groupedSeats,
  selectedSeats,
  onSelectSeat,
  showtimeId,
  userId,
}) => {
  const seatsData: SeatRowData[] = Object.keys(groupedSeats).map((row) => ({
    row,
    seats: groupedSeats[row].map(
      (s): Seat => ({
        id: s.id,
        row: s.row,
        col: s.col || "",
        number: s.seat_number || s.id,
        seat_number: s.seat_number || s.id,
        status: s.status as "AVAILABLE" | "RESERVED" | "BOOKED" | "LOCKED",
        price: s.price,
        seat: {
          id: s.id,
          seat_number: s.seat_number || s.id,
          row: s.row,
          col: s.col || "",
        },
      }) as unknown as Seat,
    ),
  }));

  return (
    <div className="w-full flex flex-col gap-6">
      <SeatRow
        seatsData={seatsData}
        selectedSeats={selectedSeats}
        onSelectSeat={onSelectSeat}
        showtimeId={showtimeId}
        userId={userId}
      />
    </div>
  );
};

export default SeatGrid;
