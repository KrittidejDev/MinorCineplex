type StepStatus = "default" | "current" | "finished";
import DoneRight from "../Icons/DoneRound";

interface StepProps {
  number: number;
  status?: StepStatus;
}

const Step = ({ number, status = "default" }: StepProps) => {
  let styles = "flex justify-center items-center size-11 rounded-full ";

  switch (status) {
    case "current":
      styles += "bg-[#4E7BEE] text-white";
      break;
    case "finished":
      styles += "bg-[#1E29A8] text-white";
      break;
    default:
      styles += "bg-[#21263F] text-white border border-white";
  }

  return <div className={styles}>{status === "finished" ? <DoneRight/> : number}</div>;
};

export default Step;