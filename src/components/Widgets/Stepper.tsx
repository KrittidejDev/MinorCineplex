import React from "react";
import { Step } from "./Step";
import { Check } from "lucide-react";

interface StepperProps {
  step: string;
}

export const Stepper: React.FC<StepperProps> = ({ step }) => {
  return (
    <div className="flex justify-center items-center gap-6 relative w-fit">
      <div className="absolute top-[22px] left-[50px] w-33 mx-auto h-[1px] bg-blue-bbee -z-10]" />
      <Step
        label="Select showtime"
        number={<Check size={20} strokeWidth={2} />}
        status="done"
      />
      <Step label="Select seat" number={2} status="current" />
      <div className="absolute top-2/7 right-[50px] w-33 mx-auto h-[1px] bg-gray-g63f -z-10]" />
      <Step label="Payment" number={3} status="default" />
    </div>
  );
};
