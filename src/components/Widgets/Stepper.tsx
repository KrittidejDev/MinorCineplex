import React from "react";
import { Step } from "./Step";
import { Check } from "lucide-react";
import { useTranslation } from "next-i18next";

interface StepperProps {
  step: string;
  onClickStep: () => void;
}

export const Stepper: React.FC<StepperProps> = ({ step, onClickStep }) => {
  const { t } = useTranslation("common");
  const currentStep = parseInt(step, 10);
  const getStatus = (index: number) => {
    if (index < currentStep) return "done";
    if (index === currentStep) return "current";
    return "default";
  };

  return (
    <div className="flex justify-center items-center md:gap-6 relative w-fit">
      <div className="absolute top-[22px] left-[50px] w-[132px] mx-auto h-[1px] bg-blue-bbee z-1" />
      <div onClick={onClickStep} className="cursor-pointer">
        <Step
          label={t("Select showtime")}
          number={
            getStatus(1) === "done" ? <Check size={20} strokeWidth={2} /> : 1
          }
          status={getStatus(1)}
        />
      </div>
      <Step
        label={t("Select seat")}
        number={
          getStatus(2) === "done" ? <Check size={20} strokeWidth={2} /> : 2
        }
        status={getStatus(2)}
      />
      <div
        className={`absolute top-[22px] right-[50px] w-[132px] mx-auto h-[1px] ${step === "3" ? "bg-blue-bbee" : "bg-gray-g63f"}`}
      />
      <Step
        label={t("Payment")}
        number={
          getStatus(3) === "done" ? <Check size={20} strokeWidth={2} /> : 3
        }
        status={getStatus(3)}
      />
    </div>
  );
};
