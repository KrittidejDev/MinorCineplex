import OutLight from "../Icons/OutLight";
import CloseRoundLight from "../Icons/CloseRoundLight";
import { BookingCard } from "../Cards/bookkingCard";
import { Button } from "../ui/button";

function BookingDetailModal() {
  return (
    <div className="relative w-screen max-w-[691px] max-h-[510px] bg-gray-g63f border border-gray-gf7e rounded-md">
      <div className="flex justify-between py-3 px-6">
        <div className="w-24"></div>
        <h4 className="text-f-20">Booking Detail</h4>
        <div className="flex justify-end gap-4">
          <div className="hover:cursor-pointer">
            <OutLight width={24} height={24} />
          </div>
          <div className="hover:cursor-pointer">
            <CloseRoundLight width={24} height={24} />
          </div>
        </div>
      </div>
      <div className="h-[284px]">
        <BookingCard
          movieTitle="The Dark Knight"
          moviePoster="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug"
          location="Minor Cineplex Arkham"
          date="24 Jun 2024"
          time="16:30"
          hall="Hall 1"
          bookingNumber="AK11223"
          bookedDate="24 Jun 2024"
          selectedSeats="C9, C10"
          ticketCount={2}
          paymentMethod="Credit card"
          isPaid={true}
          rounded={false}
        />
      </div>
      <div className="max-w-[273px] pb-2 m-6 mb-2 border-b border-gray-gf7e">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="text-fr-16">Payment method</p>
            <span className="font-bold text-fm-16">Credit card</span>
          </div>
          <div className="flex justify-between">
            <p className="text-fr-16">
              Ticket <span>x2</span>
            </p>
            <span className="font-bold text-fm-16">THB300</span>
          </div>
          <div className="flex justify-between">
            <p className="text-fr-16">Coupon</p>
            <span className="font-bold text-fm-16 text-red-r64b">-THB50</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="max-w-[273px] mx-6 mb-6">
          <div className="flex justify-between">
            <p className="text-fr-16">Total</p>
            <span className="font-bold text-fm-16">THB250</span>
          </div>
        </div>
        <div className="absolute right-6 bottom-6">
          <Button className="btn-base white-outline-normal">
            Cancel booking
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailModal;
