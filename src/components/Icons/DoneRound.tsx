import React from "react";

interface DoneRoundProps {
  width?: string | number;
  height?: string | number;
  strokeWidth?: string | number;
  color?: string;
}

const DoneRound: React.FC<DoneRoundProps> = ({
  width = "24",
  strokeWidth = "1",
  height = "24",
  color = "#FFF",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 14L8.23309 16.4248C8.66178 16.7463 9.26772 16.6728 9.60705 16.2581L18 6"
        stroke="currentColor"
        strokeWidth = {strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default DoneRound;
