import Link from "next/link";
import { Button } from "../ui/button";
import DoneRound from "../Icons/DoneRound";

const CancelSuccess = () => {
  return (
    <div className="flex items-center flex-col gap-12 w-full px-2">
      <div className="w-20 h-20 rounded-full bg-green-g372 flex items-center justify-center">
        <DoneRound width={48} height={48} strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-3 items-center">
        <h1 className="text-f-36 text-white">Cancellation successfully</h1>
        <p className="text-fr-16 text-gray-gedd">
          The cancellation is complete.
        </p>
        <p className="text-fr-16 text-center text-gray-gedd">
          You will receive an email with a detail and refund within 48 hours.
        </p>
      </div>
      <Button
        asChild
        className="btn-base blue-normal  cursor-pointer w-full max-w-[273px] h-12 flex rounded-b-sm justify-center items-center"
      >
        <Link href="/profiles/booking-history">
          <span className="text-fm-16">Back to booking history</span>
        </Link>
      </Button>
    </div>
  );
};
export default CancelSuccess;
