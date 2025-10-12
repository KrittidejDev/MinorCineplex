import React from "react";

interface ExpandLeftLightProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const ExpandLeftLight: React.FC<ExpandLeftLightProps> = ({
  width = "24",
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
      <path d="M15 6L9 12L15 18" stroke="currentColor" />
    </svg>
  );
};

export default ExpandLeftLight;
