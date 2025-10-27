import OutLight from "../Icons/OutLight";
import CloseRoundLight from "../Icons/CloseRoundLight";
import { BookingCard } from "../Cards/bookkingCard";
import { Button } from "../ui/button";
import { BookingStatus } from "@/types/booking";
import ShareButton from "../Widgets/ShareButton";

interface BookingDetailModalProps {
  movieTitle: string;
  moviePoster: string | null;
  location: string;
  date: string;
  time: string;
  hall: string;
  bookingNumber: string;
  bookedDate: string;
  selectedSeats: string;
  ticketCount: number;
  paymentMethod: string;
  status: BookingStatus;
  totalPrice: number;
  couponDiscount: number;
  onClose: () => void;
  onCancelBooking: () => void;
}

function BookingDetailModal({
  movieTitle,
  moviePoster,
  location,
  date,
  time,
  hall,
  bookingNumber,
  bookedDate,
  selectedSeats,
  ticketCount,
  paymentMethod,
  status,
  totalPrice,
  couponDiscount,
  onClose,
  onCancelBooking,
}: BookingDetailModalProps) {
  return (
    <div className="relative w-screen flex flex-col max-w-[691px] h-fit bg-gray-g63f border border-gray-gf7e rounded-md">
      <div className="flex justify-between py-3 px-6">
        <div className="w-24"></div>
        <h4 className="text-f-20">Booking Detail</h4>
        <div className="flex justify-end items-center gap-4">
          <div className="hover:cursor-pointer">
            <ShareButton color="#C8CEDD" />
          </div>
          <div onClick={onClose} className="hover:cursor-pointer">
            <CloseRoundLight width={24} height={24} />
          </div>
        </div>
      </div>
      <div>
        <BookingCard
          movieTitle={movieTitle}
          moviePoster={moviePoster}
          location={location}
          date={date}
          time={time}
          hall={hall}
          bookingNumber={bookingNumber}
          bookedDate={bookedDate}
          selectedSeats={selectedSeats}
          ticketCount={ticketCount}
          paymentMethod={paymentMethod}
          status={status as BookingStatus}
          rounded={false}
        />
      </div>
      <div className="flex flex-col mt-4">
        <div className="w-full sm:max-w-[273px] px-6 mb-6">
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between">
              <p className="text-fr-16">Payment method</p>
              <span className="font-bold text-fm-16">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <p className="text-fr-16">
                Ticket x<span>{ticketCount}</span>
              </p>
              <span className="font-bold text-fm-16">THB{totalPrice}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between">
                <p className="text-fr-16">Coupon</p>
                <span className="font-bold text-fm-16 text-red-r64b">
                  -THB{couponDiscount}
                </span>
              </div>
            )}

            <hr className="border-gray-gf7e" />
            <div className="flex justify-between">
              <p className="text-fr-16">Total</p>
              <span className="font-bold text-fm-16">THB{totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="sm:absolute m-6 mt-0 sm:m-0 right-6 bottom-6">
          <Button
            className="btn-base white-outline-normal"
            onClick={onCancelBooking}
          >
            Cancel booking
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailModal;
