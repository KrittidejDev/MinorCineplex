import React from "react";

interface AddRoundLightProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const AddRoundLight: React.FC<AddRoundLightProps> = ({
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
      <path d="M12 6L12 18" stroke={color} stroke-linecap="round" />
      <path d="M18 12L6 12" stroke={color} stroke-linecap="round" />
    </svg>
  );
};

export default AddRoundLight;
