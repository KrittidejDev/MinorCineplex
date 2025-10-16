import React from "react";

interface HamburgerProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const Hamburger: React.FC<HamburgerProps> = ({
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
      <path d="M4 6L20 6" stroke="currentColor" strokeLinecap="round" />
      <path d="M4 12L20 12" stroke="currentColor" strokeLinecap="round" />
      <path d="M4 18L20 18" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
};

export default Hamburger;
