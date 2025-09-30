import React from "react";

interface StepProps {
  label: string;
  number: number | React.ReactNode; 
  status?: "done" | "current" | "default";
}

export const Step: React.FC<StepProps> = ({ label, number, status }) => {
  const baseClass =
    "flex flex-col items-center gap-1.5 relative w-30 z-1";

  const circleClass =
    status === "done"
      ? "stp-done"
      : status === "current"
      ? "stp-current"
      : "stp-default";

  return (
    <div className={baseClass}>
      <div className={circleClass}>{number}</div>
      <p className="text-white">{label}</p>
    </div>
  );
};