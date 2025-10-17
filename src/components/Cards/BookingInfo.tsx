import { BillInfo, SelectedSeat } from "@/types/cinema";
import { Button } from "../ui/button";

const BookingInfo = ({ totalSelected, lockSeats }: BillInfo) => {
  if (!totalSelected || totalSelected.length === 0) return null;

  const sortedSeats: SelectedSeat[] = [...totalSelected].sort((a, b) => {
    if (a.row === b.row) {
      const numA = parseInt(a.seat_number.replace(/\D/g, ""), 10);
      const numB = parseInt(b.seat_number.replace(/\D/g, ""), 10);
      return numA - numB;
    }
    return a.row.localeCompare(b.row);
  });

  const totalPrice = totalSelected.reduce(
    (sum, seat) => sum + (seat.price || 0),
    0
  );

  return (
    <div className="flex flex-col gap-5 px-4 pt-4 pb-6 border-t border-gray-g63f">
      <div className="flex flex-col gap-1">
        <p className="text-gray-gedd text-fr-16">Selected Seats</p>
        <div className="flex flex-wrap gap-2 max-w-full">
          {sortedSeats.map((seat) => (
            <span
              key={seat.id}
              className="text-white text-fr-16 flex flex-col items-center"
            >
              {seat.seat_number}{" "}
              <span className="text-fr-12 text-[10px]!">({seat.price}฿)</span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <p className="text-gray-gedd text-fr-16">Total</p>
        <p className="text-white text-fr-16">{totalPrice.toLocaleString()} ฿</p>
      </div>
      <Button className="btn-base blue-normal cursor-pointer" onClick={lockSeats}>
        Next
      </Button>
    </div>
  );
};

export default BookingInfo;
