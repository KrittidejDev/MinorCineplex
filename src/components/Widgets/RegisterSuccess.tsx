import Link from "next/link";
import { Button } from "../ui/button";
import DoneRound from "../Icons/DoneRound";

const RegisterSuccess = () => {
  return (
    <div className="flex items-center flex-col gap-12">
      <div className="w-20 h-20 rounded-full bg-green-g372 flex items-center justify-center">
        <DoneRound width={48} height={48} strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-3 items-center">
        <h1 className="text-f-36 text-white">Registration success</h1>
        <p className="text-fr-16 text-gray-gedd">
          Your account has been successfully created!
        </p>
      </div>
      <Button
        asChild
        className="btn-base blue-normal  cursor-pointer w-full h-12 flex rounded-b-sm justify-center items-center"
      >
        <Link href="/">
          <span className="text-fm-16">Back to home</span>
        </Link>
      </Button>
    </div>
  );
};
export default RegisterSuccess;
