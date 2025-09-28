import React from "react";

interface CloseRoundLightProps {
  width?: string | number;
  height?: string | number;
  color?: string;
  onClick?: ()=> void
}

const CloseRoundLight: React.FC<CloseRoundLightProps> = ({
  width = "24",
  height = "24",
  color = "#FFF",
  onClick
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M18 6L6 18"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L18 18"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CloseRoundLight;
