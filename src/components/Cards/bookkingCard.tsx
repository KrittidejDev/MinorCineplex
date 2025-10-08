import PinFill from "../Icons/PinFill";
import DateTodayLight from "../Icons/DateTodayLight";
import TimeFill from "../Icons/TimeFill";
import Image from "next/image";
import Shop from "../Icons/Shop";
interface BookingCardProps {
  movieTitle: string;
  moviePoster: string;
  location: string;
  date: string;
  time: string;
  hall: string;
  bookingNumber: string;
  bookedDate: string;
  selectedSeats: string;
  ticketCount: number;
  paymentMethod: string;
  isPaid: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
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
  isPaid,
}) => {
  return (
    <div className="bg-gray-gc1b rounded-lg p-3 sm:p-6 text-white max-w-sm sm:max-w-2xl mx-auto">
      {/* Movie Section */}
      <div className="flex items-stretch gap-3 mb-4">
        {/* Movie Poster */}
        <div className="flex-shrink-0 self-stretch">
          <div className="relative w-16 sm:w-20 h-24 sm:h-28">
            <Image
              src={moviePoster}
              alt={movieTitle}
              fill
              className="w-16 sm:w-20 h-full min-h-24 sm:min-h-28 object-cover rounded"
            />
          </div>
        </div>

        {/* Movie Details */}
        <div className="flex-1 min-w-0">
          {/* Movie Title and Booking Info */}
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-lg sm:text-xl font-semibold text-white truncate flex-1 pr-2">
              {movieTitle}
            </h2>

            {/* Booking Info - Right side on Desktop */}
            <div className="flex-shrink-0 sm:flex hidden flex-col items-end">
              <div className="text-xs sm:text-sm text-gray-300 mb-1">
                Booking No. {bookingNumber}
              </div>
              <div className="text-xs sm:text-sm text-gray-300">
                Booked date {bookedDate}
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PinFill width="14" height="14" color="#FFF" />
              <span className="text-xs sm:text-sm text-gray-200 truncate">
                {location}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <DateTodayLight width="14" height="14" color="#FFF" />
              <span className="text-xs sm:text-sm text-gray-200">{date}</span>
            </div>

            <div className="flex items-center gap-2">
              <TimeFill width="14" height="14" color="#FFF" />
              <span className="text-xs sm:text-sm text-gray-200">{time}</span>
            </div>

            <div className="flex items-center gap-2">
              <Shop width="14" height="14" color="#FFF" />
              <span className="text-xs sm:text-sm text-gray-200">{hall}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Info - Bottom Left on Mobile */}
      <div className="flex flex-col sm:hidden mb-3">
        <div className="text-xs text-gray-300 mb-1">
          Booking No. {bookingNumber}
        </div>
        <div className="text-xs text-gray-300">Booked date {bookedDate}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-600 mb-3"></div>

      {/* Ticket and Payment Section */}
      <div className="flex sm:items-center sm:justify-between gap-2 flex-col sm:flex-row">
        {/* Left Section - Ticket Info + Payment method under Selected Seat */}
        <div className="flex items-start gap-2 w-full">
          {/* Ticket Count Button */}
          <button className="bg-gray-g63f text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm font-medium whitespace-nowrap">
            {ticketCount} Tickets
          </button>

          {/* Text Details stacked */}
          <div className="flex flex-col min-w-0 flex-1">
            <div className="text-xs sm:text-sm text-gray-200 w-full flex justify-between sm:justify-start">
              <span className="opacity-90">Selected Seat</span>
              <span className="font-medium sm:ml-14">{selectedSeats}</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-200 w-full flex justify-between sm:justify-start">
              <span className="opacity-90">Payment method</span>
              <span className="font-medium sm:ml-5">{paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Right Section - Paid Status Button only */}
        <div className="flex items-end w-full sm:w-auto justify-end">
          <button
            className={`px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm font-medium whitespace-nowrap ${
              isPaid ? "bg-green-g372 text-white" : "bg-red-r64b text-white"
            }`}
          >
            {isPaid ? "Paid" : "Unpaid"}
          </button>
        </div>
      </div>
    </div>
  );
};
