import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import { Stepper } from "@/components/Widgets/Stepper";
import React, { useState } from "react";

const BookingSeat = () => {
  const [step, setStep] = useState("1");

  return (
    <NavAndFooter>
      <div className="w-full flex justify-center items-center p-4 bg-gray-gc1b">
        <Stepper step={step} />
      </div>
    </NavAndFooter>
  );
};

export default BookingSeat;
