import PinFill from "../Icons/PinFill";
import DateTodayLight from "../Icons/DateTodayLight";
import TimeFill from "../Icons/TimeFill";

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

const BookingCard: React.FC<BookingCardProps> = ({
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
            {/* Booking Info - Top Right on Desktop, Bottom on Mobile */}
            <div className="text-right mb-3 sm:block hidden">
                <div className="text-xs sm:text-sm text-gray-300 mb-1">
                    Booking No. {bookingNumber}
                </div>
                <div className="text-xs sm:text-sm text-gray-300">
                    Booked date {bookedDate}
                </div>
            </div>

            {/* Movie Section */}
            <div className="flex gap-3 mb-4">
                {/* Movie Poster */}
                <div className="flex-shrink-0">
                    <img
                        src={moviePoster}
                        alt={movieTitle}
                        className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded"
                    />
                </div>

                {/* Movie Details */}
                <div className="flex-1 min-w-0">
                    {/* Movie Title */}
                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 truncate">{movieTitle}</h2>

                    {/* Movie Info */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <PinFill width="14" height="14" color="#FFF" />
                            <span className="text-xs sm:text-sm text-gray-200 truncate">{location}</span>
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
                            <div className="w-3.5 h-3.5 flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 9H21V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V9Z" fill="#FFF" />
                                    <path d="M3 11V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V11H3Z" fill="#FFF" />
                                </svg>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-200">{hall}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Info - Bottom Left on Mobile */}
            <div className="text-left sm:hidden mb-3">
                <div className="text-xs text-gray-300 mb-1">
                    Booking No. {bookingNumber}
                </div>
                <div className="text-xs text-gray-300">
                    Booked date {bookedDate}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-600 mb-3"></div>

            {/* Ticket and Payment Section */}
            <div className="flex items-center justify-between gap-2">
                {/* Left Section - Ticket Info */}
                <div className="flex items-center gap-2 flex-1">
                    {/* Ticket Count Button */}
                    <button className="bg-gray-g63f text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm font-medium whitespace-nowrap">
                        {ticketCount} Tickets
                    </button>

                    {/* Ticket Details */}
                    <div className="text-xs sm:text-sm text-gray-200 truncate">
                        Selected Seat {selectedSeats}
                    </div>
                </div>

                {/* Right Section - Payment Info */}
                <div className="flex flex-col items-end gap-1">
                    <div className="text-xs sm:text-sm text-gray-200 text-right">
                        Payment method {paymentMethod}
                    </div>

                    {/* Paid Status Button */}
                    <button
                        className={`px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm font-medium whitespace-nowrap ${isPaid
                            ? 'bg-green-g372 text-white'
                            : 'bg-red-r64b text-white'
                            }`}
                    >
                        {isPaid ? 'Paid' : 'Unpaid'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;
