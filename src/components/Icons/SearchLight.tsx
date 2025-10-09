import React from "react";

interface SearchLightProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const SearchLight: React.FC<SearchLightProps> = ({
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
      <circle cx="11" cy="11" r="6" stroke="currentColor" />
      <path d="M20 20L17 17" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
};

export default SearchLight;
