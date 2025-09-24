import SeatRow from "./SeatRow";

interface SeatGridProps {
  groupedSeats: Record<string, { id: string; row: string; status: string; price: number; }[]>;
  onSelectSeat: (seatId: string) => void;
}

const SeatGrid: React.FC<SeatGridProps> = ({ groupedSeats, onSelectSeat }) => {
  return (
    <div className="flex flex-col gap-6">
      {Object.keys(groupedSeats).map((row) => (
        <SeatRow
          key={row}
          rowLabel={row}
          seats={groupedSeats[row]}
          onSelectSeat={onSelectSeat}
        />
      ))}
    </div>
  );
};

export default SeatGrid;