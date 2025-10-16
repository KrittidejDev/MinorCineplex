import React from "react";

interface MinusProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const Minus: React.FC<MinusProps> = ({
  width = "24",
  height = "24",
  color = "white",
}) => {
  return (
    <svg
      color={color}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Minus;
