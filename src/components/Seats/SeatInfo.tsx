import SeatAvailable from "@/components/Icons/SeatAvailable";
import SeatBooked from "@/components/Icons/SeatBooked";
import SeatReserved from "@/components/Icons/SeatReserved";

const SeatInfo = () => (
  <div className="border-t border-gray-gedd flex gap-10 py-4">
    <div className="bg-gray-g63f py-3 px-4 rounded-sm">
      <h1 className="text-f-24 text-gray-gedd">Hall 1</h1>
    </div>
    <div className="flex gap-4 items-center">
      <SeatAvailable />
      <div className="flex flex-col justify-center">
        <p className="text-gray-gedd">Available Seat</p>
        <p className="text-gray-gedd">THB150</p>
      </div>
    </div>
    <div className="flex gap-4 items-center">
      <SeatBooked />
      <p className="text-gray-gedd">Booked Seat</p>
    </div>
    <div className="flex gap-4 items-center">
      <SeatReserved />
      <p className="text-gray-gedd">Reserved Seat</p>
    </div>
  </div>
);

export default SeatInfo;