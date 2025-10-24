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
  rounded?: boolean;
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
  rounded = true,
}) => {
  const movieInfo = [
    { icon: PinFill, value: location },
    { icon: DateTodayLight, value: date },
    { icon: TimeFill, value: time },
    { icon: Shop, value: hall },
  ];
  const bookingInfo = [
    { label: "Booking No.", value: bookingNumber },
    { label: "Booked date", value: bookedDate },
  ];
  const ticketInfo = [
    { label: "Selected Seat", value: selectedSeats },
    { label: "Payment method", value: paymentMethod },
  ];
  return (
    <div className={`bg-gray-gc1b p-4 md:p-6 text-white ${rounded ? "rounded-lg" : "rounded-none"}`}>
      {/* Movie Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pb-4 md:pb-6 md:gap-6">
        {/* Movie Poster */}
        <div className="flex items-center gap-3">
          <div className="flex">
            <div className="relative min-w-[97px] min-h-[140px]">
              <Image
                src={moviePoster}
                alt={movieTitle}
                fill
                className="object-cover rounded"
              />
            </div>
          </div>

          {/* Movie Details */}
          <div className="flex flex-col gap-4">
            {/* Movie Title and Booking Info */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-f-20 text-white">{movieTitle}</h2>
            </div>

            {/* Movie Info */}
            <div className="flex flex-col gap-1">
              {movieInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-2">
                  <info.icon width="14" height="14" color="#565F7E" />
                  <span className="text-fr-14 text-gray-gedd">
                    {info.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Booking Info - Right side on Desktop */}
        <div className="flex flex-col gap-1">
          {bookingInfo.map((booking, index) => (
            <div
              key={index}
              className="flex gap-1 md:gap-2 md:flex-row md:justify-start text-fm-14 text-gray-g3b0"
            >
              <span>{booking.label}</span>
              <span>{booking.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      {/* <div className="border-t border-gray-g63f mb-4"></div> */}

      {/* Ticket and Payment Section */}
      <div className="flex sm:items-center sm:justify-between pt-6 gap-4 md:gap-6 flex-col sm:flex-row border-t border-gray-g63f">
        {/* Left Section - Ticket Info + Payment method under Selected Seat */}
        <div className="flex items-center gap-6 md:gap-2 w-full">
          {/* Ticket Count Button */}
          <button className="bg-gray-g63f text-gray-gedd font-fm-16 rounded-sm px-4 py-3">
            {ticketCount} Tickets
          </button>

          {/* Text Details stacked */}
          <div className="flex flex-col justify-between gap-1 flex-1">
            {ticketInfo.map((ticket, index) => (
              <div
                key={index}
                className="text-fr-14 text-gray-g3b0 w-full flex gap-1 justify-between"
              >
                <span>{ticket.label}</span>
                <span>{ticket.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Paid Status Button only */}
        <div className="flex w-full justify-end">
          <button
            className={`px-4 py-1.5 rounded-full text-fm-14 ${
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
