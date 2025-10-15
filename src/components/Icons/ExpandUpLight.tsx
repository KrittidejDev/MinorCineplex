import React from "react";

interface ExpandUpLightProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const ExpandUpLight: React.FC<ExpandUpLightProps> = ({
  width = "24",
  height = "24",
  color = "#FFF",
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
      <path d="M18 15L12 9L6 15" stroke="currentColor" />
    </svg>
  );
};

export default ExpandUpLight;
