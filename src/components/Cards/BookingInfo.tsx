import { Button } from "../ui/button";
import { BillInfo } from "./SummaryBoxCard";

const BookingInfo = ({ totalSelected, totalPrice }: BillInfo) => {
  return (
    <div className="flex flex-col gap-5 px-4 pt-4 pb-6 border-t border-gray-g63f">
      <div className="flex justify-between">
        <p className="text-gray-gedd text-fr-16">Selected Seat</p>
        <div className="max-w-[150px] break-all">
          {totalSelected?.map((seat, index) => (
            <span key={seat.id} className="text-white text-fr-16">
              {index !== 0 && <span>,</span>}
              {seat.id}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <p className="text-gray-gedd text-fr-16">Total</p>
        <p className="text-white text-fr-16">THB{totalPrice}</p>
      </div>
      <Button className="btn-base blue-normal">Next</Button>
    </div>
  );
};
export default BookingInfo;
