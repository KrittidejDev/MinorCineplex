import React from "react";
import { Step } from "./Step";
import { Check } from "lucide-react"; 

export const Stepper: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center gap-6 relative">
      <div className="absolute top-2/7 w-66 mx-auto h-[1px] bg-gray-g63f -z-10]"></div>
      <Step
        label="Select showtime"
        number={<Check size={20} strokeWidth={2} />}
        status="done"
      />
      <Step label="Select seat" number={2} status="current" />
      <Step label="Payment" number={3} status="default" />
    </div>
  );
};