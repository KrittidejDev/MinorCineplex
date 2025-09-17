import React from "react";

interface ArrowDownProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const ArrowDown: React.FC<ArrowDownProps> = ({
  width = "24",
  height = "24",
  color = "#8B93B0",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 9L12 15L6 9" stroke={color} />
    </svg>
  );
};

export default ArrowDown;
